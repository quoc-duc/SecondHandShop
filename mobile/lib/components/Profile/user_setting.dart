import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/models/user_model.dart';
import '../../providers/userProfile_provider.dart';
import '../../providers/login_info.dart';
import '../UI/edit_text_field.dart';
import '../UI/custom_button.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:io';
import 'package:path/path.dart' as path;
import '../../providers/location_provider.dart';
import '../UI/dropdown_field.dart';

class UserInformation extends StatefulWidget {
  @override
  State<UserInformation> createState() => _UserInformationState();
}

class _UserInformationState extends State<UserInformation> {
  late TextEditingController nameController;
  late TextEditingController usernameController;
  late TextEditingController phoneController;
  late TextEditingController emailController;
  late TextEditingController addressController;
  late TextEditingController avatarUrlController;
  String? selectedProvinceId;
  String? selectedDistrictId;
  String? provinceName; // Lưu tên tỉnh để hiển thị
  String? districtName; // Lưu tên quận/huyện để hiển thị

  bool isLoading = false;
  bool isEditing = false;

  @override
  void initState() {
    super.initState();
    final loginInfo = Provider.of<LoginInfo>(context, listen: false);
    final userId = loginInfo.id;
    nameController = TextEditingController();
    usernameController = TextEditingController();
    phoneController = TextEditingController();
    emailController = TextEditingController();
    addressController = TextEditingController();
    avatarUrlController = TextEditingController();
    selectedProvinceId = null;
    selectedDistrictId = null;
    provinceName = null;
    districtName = null;

    WidgetsBinding.instance.addPostFrameCallback((_) async {
      final profileProvider =
          Provider.of<UserProfileProvider>(context, listen: false);
      final locationProvider =
          Provider.of<LocationProvider>(context, listen: false);

      // Tải thông tin người dùng
      await profileProvider.fetchUser(userId!);
      final user = profileProvider.user!;

      // Tải danh sách tỉnh
      await locationProvider.fetchProvinces();

      setState(() {
        nameController = TextEditingController(text: user.name);
        usernameController = TextEditingController(text: user.username);
        phoneController = TextEditingController(text: user.phone);
        emailController = TextEditingController(text: user.email);
        addressController = TextEditingController(text: user.address);
        avatarUrlController = TextEditingController(text: user.avatarUrl);

        // Kiểm tra và gán provinceId, tìm tên tỉnh
        if (user.provinceId != null &&
            locationProvider.provinces
                .any((province) => province.id.toString() == user.provinceId)) {
          selectedProvinceId = user.provinceId;
          provinceName = locationProvider.provinces
              .firstWhere(
                  (province) => province.id.toString() == user.provinceId)
              .name;
          // Tải danh sách quận/huyện
          locationProvider.fetchDistricts(selectedProvinceId!);
        }

        // Kiểm tra và gán districtId, tìm tên quận/huyện
        if (user.districtId != null) {
          // Chờ danh sách quận/huyện được tải
          Future.delayed(Duration(milliseconds: 500), () {
            setState(() {
              if (locationProvider.districts.any(
                  (district) => district.id.toString() == user.districtId)) {
                selectedDistrictId = user.districtId;
                districtName = locationProvider.districts
                    .firstWhere(
                        (district) => district.id.toString() == user.districtId)
                    .name;
              }
            });
          });
        }
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final profileProvider = Provider.of<UserProfileProvider>(context);
    final locationProvider = Provider.of<LocationProvider>(context);
    final user = profileProvider.user;

    if (user == null || locationProvider.provinces.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: Text('Thông tin cá nhân')),
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      appBar: AppBar(title: Text('Thông tin cá nhân')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            GestureDetector(
              onTap: () async {
                FilePickerResult? result = await FilePicker.platform.pickFiles(
                  type: FileType.image,
                );

                if (result != null && result.files.single.path != null) {
                  File imageFile = File(result.files.single.path!);

                  setState(() {
                    isLoading = true;
                  });

                  // Gửi ảnh lên Cloudinary hoặc server
                  final imageUrl =
                      await profileProvider.uploadImageToCloudinary(imageFile);

                  if (imageUrl != null) {
                    setState(() {
                      avatarUrlController.text = imageUrl;
                    });
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Tải ảnh thành công!')),
                    );
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Tải ảnh thất bại!')),
                    );
                  }

                  setState(() {
                    isLoading = false;
                  });
                }
              },
              child: Stack(
                alignment: Alignment.center,
                children: [
                  CircleAvatar(
                    radius: 50,
                    backgroundImage: avatarUrlController.text.isNotEmpty
                        ? NetworkImage(avatarUrlController.text)
                        : AssetImage('assets/default_avatar.png')
                            as ImageProvider,
                  ),
                  if (isEditing)
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: CircleAvatar(
                        backgroundColor: Colors.white,
                        radius: 15,
                        child: Icon(Icons.edit, size: 18),
                      ),
                    ),
                ],
              ),
            ),
            EditableTextField(
              label: 'Tên',
              controller: nameController,
              icon: Icons.person,
              isEnabled: isEditing,
            ),
            EditableTextField(
              label: 'Username',
              controller: usernameController,
              icon: Icons.person_outline,
              isEnabled: isEditing,
            ),
            EditableTextField(
              label: 'Số điện thoại',
              controller: phoneController,
              icon: Icons.phone,
              isEnabled: isEditing,
            ),
            EditableTextField(
              label: 'Email',
              controller: emailController,
              icon: Icons.email,
              isEnabled: isEditing,
            ),
            EditableDropdown(
              label: 'Tỉnh/Thành phố',
              icon: Icons.location_city,
              value: selectedProvinceId,
              displayText: provinceName,
              isEditing: isEditing,
              items: locationProvider.provinces.map((province) {
                return DropdownMenuItem<String>(
                  value: province.id.toString(),
                  child: Text(province.name),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  selectedProvinceId = value;
                  selectedDistrictId = null;
                  districtName = null;
                  if (value != null) {
                    locationProvider.fetchDistricts(value);
                  }
                });
              },
            ),
            EditableDropdown(
              label: 'Quận/Huyện',
              icon: Icons.location_on,
              value: selectedDistrictId,
              displayText: districtName,
              isEditing: isEditing,
              items: locationProvider.districts.map((district) {
                return DropdownMenuItem<String>(
                  value: district.id.toString(),
                  child: Text(district.name),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  selectedDistrictId = value;
                  if (value != null) {
                    districtName = locationProvider.districts
                        .firstWhere((d) => d.id.toString() == value)
                        .name;
                  }
                });
              },
            ),
            EditableTextField(
              label: 'Địa chỉ chi tiết',
              controller: addressController,
              icon: Icons.home,
              isEnabled: isEditing,
            ),
            const SizedBox(height: 20),
            isLoading
                ? CircularProgressIndicator()
                : CustomButton(
                    text: isEditing ? 'Lưu' : 'Sửa thông tin',
                    onPressed: () async {
                      if (!isEditing) {
                        setState(() {
                          isEditing = true;
                        });
                      } else {
                        setState(() {
                          isLoading = true;
                        });

                        final updatedUser = User(
                          id: user.id,
                          name: nameController.text,
                          username: usernameController.text,
                          phone: phoneController.text,
                          email: emailController.text,
                          address: addressController.text,
                          avatarUrl: avatarUrlController.text,
                          password: user.password,
                          provinceId: selectedProvinceId,
                          districtId: selectedDistrictId,
                        );

                        try {
                          await profileProvider.updateUser(
                              user.id, updatedUser);
                          // Cập nhật tên tỉnh và quận/huyện sau khi lưu
                          setState(() {
                            provinceName = selectedProvinceId != null
                                ? locationProvider.provinces
                                    .firstWhere((province) =>
                                        province.id.toString() ==
                                        selectedProvinceId)
                                    .name
                                : null;
                            districtName = selectedDistrictId != null
                                ? locationProvider.districts
                                    .firstWhere((district) =>
                                        district.id.toString() ==
                                        selectedDistrictId)
                                    .name
                                : null;
                          });
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Cập nhật thành công')),
                          );
                          setState(() {
                            isEditing = false;
                          });
                        } catch (e) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Cập nhật thất bại')),
                          );
                        }

                        setState(() {
                          isLoading = false;
                        });
                      }
                    },
                  ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    nameController.dispose();
    usernameController.dispose();
    phoneController.dispose();
    emailController.dispose();
    addressController.dispose();
    avatarUrlController.dispose();
    super.dispose();
  }
}
