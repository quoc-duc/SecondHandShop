import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/search_provider.dart';
import '../UI/product_card.dart';
import '../UI/search_input.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({Key? key}) : super(key: key);

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController _controller = TextEditingController();
  final TextEditingController _brandController = TextEditingController();
  final TextEditingController _minPriceController = TextEditingController();
  final TextEditingController _maxPriceController = TextEditingController();
  final TextEditingController _originController = TextEditingController();
  String? _condition;

  void _onSearch() {
    String key = _controller.text;
    String brand = _brandController.text;
    double? minPrice = _minPriceController.text.isNotEmpty
        ? double.tryParse(_minPriceController.text)
        : null;
    double? maxPrice = _maxPriceController.text.isNotEmpty
        ? double.tryParse(_maxPriceController.text)
        : null;
    String origin = _originController.text;

    Provider.of<SearchProvider>(context, listen: false).searchProducts(
      key: key.isNotEmpty ? key : '',
      brand: brand.isNotEmpty ? brand : null,
      minPrice: minPrice,
      maxPrice: maxPrice,
      origin: origin.isNotEmpty ? origin : null,
      condition: _condition,
    );
  }

  @override
  Widget build(BuildContext context) {
    final results = Provider.of<SearchProvider>(context).results;

    return Scaffold(
      appBar: AppBar(
        title: Column(
          children: [
            SearchInput(
              controller: _controller,
              onSubmitted: (key) => _onSearch(),
            ),
          ],
        ),
        backgroundColor: const Color.fromARGB(255, 255, 238, 84),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            children: [
              TextField(
                controller: _brandController,
                decoration: InputDecoration(labelText: 'Thương hiệu'),
              ),
              TextField(
                controller: _minPriceController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(labelText: 'Giá tối thiểu'),
              ),
              TextField(
                controller: _maxPriceController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(labelText: 'Giá tối đa'),
              ),
              TextField(
                controller: _originController,
                decoration: InputDecoration(labelText: 'Xuất xứ'),
              ),
              DropdownButton<String>(
                value: _condition,
                hint: Text('Tình trạng (tùy chọn)'),
                onChanged: (newCondition) {
                  setState(() {
                    _condition = newCondition == 'Tất cả' ? null : newCondition;
                  });
                },
                items: ['Tất cả', 'new', 'used', 'tái chế']
                    .map((condition) => DropdownMenuItem<String>(
                          value: condition,
                          child: Text(condition),
                        ))
                    .toList(),
              ),
              ElevatedButton(
                onPressed: _onSearch,
                child: Text('Tìm kiếm'),
              ),
              const SizedBox(height: 10),
              results.isEmpty
                  ? Text('Không có kết quả')
                  : GridView.builder(
                      shrinkWrap: true,
                      physics: NeverScrollableScrollPhysics(),
                      itemCount: results.length,
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 10,
                        mainAxisSpacing: 10,
                        childAspectRatio: 0.7,
                      ),
                      itemBuilder: (context, index) {
                        final product = results[index];
                        return ProductCard(product: product);
                      },
                    ),
            ],
          ),
        ),
      ),
    );
  }
}
