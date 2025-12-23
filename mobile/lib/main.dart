import 'package:flutter/material.dart';
import 'package:mobile/providers/login_info.dart';
import 'package:provider/provider.dart';
import './components/Home/main_screen.dart';
import './providers/signup_provider.dart';
import './providers/userProfile_provider.dart';
import '../providers/regulation_provider.dart';
import '../providers/feedback.provider.dart';
import '../providers/search_provider.dart';
import '../providers/location_provider.dart';

void main() {
  runApp(MultiProvider(
    providers: [
      ChangeNotifierProvider(create: (context) => LoginInfo()),
      ChangeNotifierProvider(create: (context) => SignUpProvider()),
      ChangeNotifierProvider(create: (context) => UserProfileProvider()),
      ChangeNotifierProvider(create: (context) => RegulationProvider()),
      ChangeNotifierProvider(create: (context) => FeedbackProvider()),
      ChangeNotifierProvider(create: (context) => SearchProvider()),
      ChangeNotifierProvider(create: (context) => LocationProvider()),
    ],
    child: const MyApp(),
  ));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Navigation Example',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        scaffoldBackgroundColor: Colors.white,
      ),
      home: MainScreen(), // Chuyển đến MainScreen
      debugShowCheckedModeBanner: false,
    );
  }
}
