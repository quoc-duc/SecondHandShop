class User {
  final String id;
  final String email;
  final String username;
  final String password;
  final String? name;
  final String? address;
  final String? phone;
  final String? avatarUrl;
  final String? role;
  final bool? ban;
  final String? qrPayment;
  final bool? status;
  final String? provinceId;
  final String? districtId;

  User({
    required this.id,
    required this.username,
    required this.password,
    required this.email,
    this.name,
    this.address,
    this.phone,
    this.avatarUrl,
    this.role,
    this.ban,
    this.qrPayment,
    this.status,
    this.provinceId,
    this.districtId,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'] ?? '',
      email: json['email'] ?? '',
      username: json['username'] ?? '',
      password: json['password'] ?? '',
      name: json['name'] ?? '',
      address: json['address'] ?? '',
      phone: json['phone'] ?? '',
      avatarUrl: json['avatar_url'] ?? '',
      role: json['role'] ?? 'user',
      ban: json['ban'] == 1,
      qrPayment: json['qrPayment'] ?? '',
      status: json['status'] == 1,
      provinceId: json['provinceId'] ?? '',
      districtId: json['districtId'] ?? '',
    );
  }
}
