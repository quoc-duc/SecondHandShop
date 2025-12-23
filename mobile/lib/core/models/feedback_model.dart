class UserFeedback {
  final String? id;
  final String? userId;
  final String? email;
  final String? message;
  final bool? status;

  UserFeedback({
    this.id,
    required this.email,
    required this.userId,
    this.message,
    this.status,
  });

  factory UserFeedback.fromJson(Map<String, dynamic> json) {
    return UserFeedback(
      id: json['_id'] ?? '',
      userId: json['user_id'] ?? '',
      email: json['email'] ?? '',
      message: json['message'] ?? '',
      status: json['status'] == 1,
    );
  }
}
