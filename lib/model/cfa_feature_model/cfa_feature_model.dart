import 'package:flutter/material.dart';

class CfaFeatureModel {
  final String title;
  final String description;
  final IconData icon;
  final String? imagePath;
  final VoidCallback? onTap;

  const CfaFeatureModel({
    required this.title,
    required this.description,
    required this.icon,
    this.imagePath,
    this.onTap,
  });
}