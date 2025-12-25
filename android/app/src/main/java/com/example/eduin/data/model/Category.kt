package com.example.eduin.data.model

import com.google.gson.annotations.SerializedName

data class Category(
    val id: Int,
    val type: String, // 'exam' or 'class'
    val value: String, // 'JEE', 'NEET', '10', '12'
    val config: Map<String, List<String>> // Map of Subject -> List of Chapters
)
