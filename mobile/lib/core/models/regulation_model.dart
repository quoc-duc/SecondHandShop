class Regulation {
  final String id;
  final String user_id_create;
  final String title;
  final String description;
  final bool? status;

  Regulation({
    required this.id,
    required this.user_id_create,
    required this.title,
    required this.description,
    this.status,
  });

  factory Regulation.fromJson(Map<String, dynamic> json) {
    return Regulation(
      id: json['_id'] ?? '',
      user_id_create: json['user_id_create'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      status: json['status'] == 1,
    );
  }
}
