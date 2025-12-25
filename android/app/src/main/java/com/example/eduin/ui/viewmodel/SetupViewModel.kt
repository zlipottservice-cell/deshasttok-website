package com.example.eduin.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.eduin.data.api.RetrofitClient
import com.example.eduin.data.model.Category
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class SetupUiState(
    val subjects: List<String> = emptyList(),
    val chapters: List<String> = emptyList(),
    val selectedSubject: String = "",
    val selectedChapter: String = "All Chapters",
    val difficulty: String = "Medium",
    val questionCount: Int = 20,
    val timeLimit: Int = 0,
    val isLoading: Boolean = false,
    val configData: Map<String, List<String>> = emptyMap()
)

class SetupViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(SetupUiState())
    val uiState: StateFlow<SetupUiState> = _uiState

    fun loadConfig(type: String, value: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            try {
                val categories = RetrofitClient.apiService.getConfig(type, value)
                if (categories.isNotEmpty()) {
                    val parsedConfig = categories[0].config
                    val subjects = parsedConfig.keys.toList()
                    _uiState.value = _uiState.value.copy(
                        configData = parsedConfig,
                        subjects = subjects,
                        selectedSubject = subjects.firstOrNull() ?: "",
                        isLoading = false
                    )
                    
                    if (subjects.isNotEmpty()) {
                        updateChapters(subjects[0])
                    }
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(isLoading = false)
                // Handle error
            }
        }
    }

    fun onSubjectSelected(subject: String) {
        _uiState.value = _uiState.value.copy(selectedSubject = subject, selectedChapter = "All Chapters")
        updateChapters(subject)
    }

    private fun updateChapters(subject: String) {
        val chapters = _uiState.value.configData[subject] ?: emptyList()
        _uiState.value = _uiState.value.copy(chapters = chapters)
    }

    fun onChapterSelected(chapter: String) {
        _uiState.value = _uiState.value.copy(selectedChapter = chapter)
    }

    fun onDifficultySelected(difficulty: String) {
        _uiState.value = _uiState.value.copy(difficulty = difficulty)
    }

    fun onQuestionCountSelected(count: Int) {
        _uiState.value = _uiState.value.copy(questionCount = count)
    }

    fun onTimeLimitSelected(mins: Int) {
        _uiState.value = _uiState.value.copy(timeLimit = mins)
    }
}
