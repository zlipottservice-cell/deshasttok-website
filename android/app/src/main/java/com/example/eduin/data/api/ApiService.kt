package com.example.eduin.data.api

import com.example.eduin.data.model.Category
import com.example.eduin.data.model.Question
import retrofit2.http.GET
import retrofit2.http.Query

interface ApiService {
    @GET("questions")
    suspend fun getQuestions(
        @Query("difficulty") difficulty: String? = null,
        @Query("limit") limit: Int? = null,
        @Query("exam") exam: String? = null,
        @Query("standard") standard: Int? = null,
        @Query("subject") subject: String? = null,
        @Query("chapter") chapter: String? = null
    ): List<Question>

    @GET("config")
    suspend fun getConfig(
        @Query("type") type: String,
        @Query("value") value: String
    ): List<Category>
}
