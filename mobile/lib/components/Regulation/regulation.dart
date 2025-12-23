import 'package:flutter/material.dart';
import 'package:mobile/providers/regulation_provider.dart';
import 'package:mobile/providers/login_info.dart';
import 'package:provider/provider.dart';

class Regulation extends StatefulWidget {
  @override
  State<Regulation> createState() => _RegulationState();
}

class _RegulationState extends State<Regulation> {
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      final regulationProvider =
          Provider.of<RegulationProvider>(context, listen: false);
      await regulationProvider.fetchRegulations();
      setState(() {
        isLoading = false;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final regulationProvider = Provider.of<RegulationProvider>(context);
    final regulations = regulationProvider.regulations;

    return Scaffold(
      appBar: AppBar(title: Text('Quy định hệ thống')),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: regulations.length,
              itemBuilder: (context, index) {
                final regulation = regulations[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          regulation.title,
                          style: TextStyle(
                              fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                        SizedBox(height: 8),
                        Text(
                          regulation.description,
                          style: TextStyle(fontSize: 16),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
