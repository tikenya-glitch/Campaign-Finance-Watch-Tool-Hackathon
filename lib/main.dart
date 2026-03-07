import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:trans_portal/views/cfa/cf_analytics.dart';
import 'package:trans_portal/views/cfa/components/profiles/pp_funds/pp_funds_profile.dart';
import 'package:trans_portal/views/landing_page/landing_page.dart';
import 'package:trans_portal/views/landing_page/sections/about/about_page.dart';
import 'package:trans_portal/views/landing_page/sections/home/home_page.dart';
import 'package:trans_portal/views/landing_page/sections/info/info_page.dart';

// void main() {
//   runApp(const MyApp());
// }

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: 'https://uaxdyysgnpxgcivukpig.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVheGR5eXNnbnB4Z2NpdnVrcGlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MzE3OTgsImV4cCI6MjA4ODQwNzc5OH0.EtVm7szjdl1CB26sRU2A4T0QF-N65sZA4KfckLxcdDo',
  );

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
      home: const CampaignFinanceAnalyticsPage(),
    );
  }
}
