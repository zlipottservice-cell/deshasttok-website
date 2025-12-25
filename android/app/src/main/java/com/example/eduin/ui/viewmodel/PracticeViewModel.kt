package com.example.eduin.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.eduin.data.api.RetrofitClient
import com.example.eduin.data.model.Question
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class PracticeUiState(
    val questions: List<Question> = emptyList(),
    val currentIdx: Int = 0,
    val isLoading: Boolean = true,
    val error: String? = null,
    val timeLeft: Int? = null,
    val isCompleted: Boolean = false,
    val isAnswered: Boolean = false,
    val scores: QuizScores = QuizScores()
)

data class QuizScores(
    val correct: Int = 0,
    val wrong: Int = 0,
    val skipped: Int = 0
)

class PracticeViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(PracticeUiState())
    val uiState: StateFlow<PracticeUiState> = _uiState

    private var timerJob: Job? = null

    fun startPractice(config: Map<String, Any>) {
        val timeLimit = config["timeLimit"] as? Int ?: 0
        if (timeLimit > 0) {
            _uiState.value = _uiState.value.copy(timeLeft = timeLimit * 60)
            startTimer()
        }

        viewModelScope.launch {
            try {
                val questions = RetrofitClient.apiService.getQuestions(
                    difficulty = if (config["difficulty"] == "Mixed") null else config["difficulty"] as? String,
                    limit = config["limit"] as? Int,
                    exam = if (config["type"] == "exam") config["value"] as? String else null,
                    standard = if (config["type"] == "class") (config["value"] as? String)?.toIntOrNull() else null,
                    subject = config["subject"] as? String,
                    chapter = if (config["chapter"] == "All Chapters") null else config["chapter"] as? String
                )
                _uiState.value = _uiState.value.copy(questions = questions, isLoading = false)
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(isLoading = false, error = "Failed to load questions")
            }
        }
    }

    private fun startTimer() {
        timerJob?.cancel()
        timerJob = viewModelScope.launch {
            while ((_uiState.value.timeLeft ?: 0) > 0 && !_uiState.value.isCompleted) {
                delay(1000)
                _uiState.value = _uiState.value.copy(timeLeft = (_uiState.value.timeLeft ?: 0) - 1)
            }
        }
    }

    fun handleAnswer(isCorrect: Boolean) {
        if (_uiState.value.isAnswered) return
        
        val newScores = if (isCorrect) {
            _uiState.value.scores.copy(correct = _uiState.value.scores.correct + 1)
        } else {
            _uiState.value.scores.copy(wrong = _uiState.value.scores.wrong + 1)
        }
        
        _uiState.value = _uiState.value.copy(isAnswered = true, scores = newScores)
    }

    fun handleNext() {
        val state = _uiState.value
        if (!state.isAnswered) {
            _uiState.value = state.copy(scores = state.scores.copy(skipped = state.scores.skipped + 1))
        }

        if (state.currentIdx < state.questions.size - 1) {
            _uiState.value = _uiState.value.copy(
                currentIdx = state.currentIdx + 1,
                isAnswered = false
            )
        } else {
            _uiState.value = _uiState.value.copy(isCompleted = true)
        }
    }

    fun handlePrev() {
        if (_uiState.value.currentIdx > 0) {
            _uiState.value = _uiState.value.copy(
                currentIdx = _uiState.value.currentIdx - 1,
                isAnswered = true
            )
        }
    }
}
