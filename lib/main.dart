import 'package:flutter/material.dart';
import 'package:trans_portal/views/landing_page/landing_page.dart';
import 'package:trans_portal/views/landing_page/sections/about_page.dart';
import 'package:trans_portal/views/landing_page/sections/home_page.dart';
import 'package:trans_portal/views/landing_page/sections/info_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(

      // Remove the debug banner in the top right corner of the app
      debugShowCheckedModeBanner: false,

      // Application Title (used by browsers / OS)
      title: 'Transparency Portal',

      // Global Themes Configuration
      // Configure Material 3 Design System
      theme: ThemeData(
        // Generate a full colour scheme from a seed colour
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.indigo, // Base colour for generating the colour scheme
          brightness: Brightness.light, // Use light mode
        ),
        // Use Material 3 design system
        useMaterial3: true,
      ),
      // Set the initial screen of the app to LandingApp
      home: const LandingPage(),
    );
  }
}
