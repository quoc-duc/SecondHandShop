import Feedbacks from "../../../User/models/Feedbacks.js";
import Users from "../../../User/models/Users.js";
import nodemailer from "nodemailer";

const getAllFeedbacks = async (page = 1, limit = 10, sort, filter) => {
  try {
    const query = {
      status: true,
    };
    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: query },
      {
        $addFields: {
          user_id: {
            $convert: {
              input: "$user_id",
              to: "objectId",
              onError: "$user_id",
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          username: {
            $ifNull: ["$user.name", "Unknown User"],
          },
        },
      },
      ...(filter
        ? [
            {
              $match: {
                [filter[0]]: {
                  $regex: filter[1],
                  $options: "i",
                },
              },
            },
          ]
        : []),
      { $project: { user: 0 } },
      ...(sort ? [{ $sort: { [sort[1]]: sort[0] === "asc" ? 1 : -1 } }] : []),
      { $skip: skip },
      { $limit: limit },
    ];

    const feedbacks = await Feedbacks.aggregate(pipeline);
    const totalFeedbacks = await Feedbacks.countDocuments(query);
    const totalPages = Math.ceil(totalFeedbacks / limit);
    return {
      feedbacks,
      totalFeedbacks,
      totalPages,
      limit,
      currentPage: page,
    };
  } catch (error) {
    throw new Error("Error fetching products: " + error.message);
  }
};

// Gửi email trả lời phản hồi
const replyToFeedback = async (feedbackId, subject, message) => {
  try {
    const feedback = await Feedbacks.findById(feedbackId);
    if (!feedback) throw new Error("Feedback not found");

    // Gửi email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "tampham11072003@gmail.com",
        pass: "krlo bkwp oqiw xrxj",
      },
    });

    const mailOptions = {
      from: "tampham11072003@gmail.com",
      to: feedback.email,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);

    // (Tuỳ chọn) Cập nhật trạng thái feedback đã được trả lời
    feedback.replied = true;
    await feedback.save();

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    throw new Error("Error replying to feedback: " + error.message);
  }
};
export { getAllFeedbacks, replyToFeedback };
