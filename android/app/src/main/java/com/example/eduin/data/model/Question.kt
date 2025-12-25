package com.example.eduin.data.model

import com.google.gson.annotations.SerializedName

data class Question(
    val id: Int,
    @SerializedName("question_text") val questionText: String?,
    @SerializedName("question_image_url") val questionImageUrl: String?,
    @SerializedName("option_a") val optionA: String,
    @SerializedName("option_b") val optionB: String,
    @SerializedName("option_c") val optionC: String,
    @SerializedName("option_d") val optionD: String,
    @SerializedName("correct_option") val correctOption: String,
    val explanation: String?,
    val difficulty: String?,
    val exam: String?,
    val board: String?,
    @SerializedName("class") val standard: Int?,
    val subject: String?,
    val chapter: String?
)
