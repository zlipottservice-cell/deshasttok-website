package com.example.eduin.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Timer
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.Alignment
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.AsyncImage
import com.example.eduin.data.model.Question
import com.example.eduin.ui.theme.*
import com.example.eduin.ui.viewmodel.PracticeViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PracticeScreen(
    config: Map<String, Any>,
    onBack: () -> Unit,
    onComplete: (Map<String, Any>) -> Unit,
    viewModel: PracticeViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(config) {
        viewModel.startPractice(config)
    }

    if (uiState.isCompleted) {
        LaunchedEffect(Unit) {
            onComplete(mapOf(
                "total" to uiState.questions.size,
                "correct" to uiState.scores.correct,
                "wrong" to uiState.scores.wrong,
                "skipped" to uiState.scores.skipped
            ))
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(AppBackground)
    ) {
        Column(
            modifier = Modifier.fillMaxSize()
        ) {
            // Professional Navigation Bar
            HeaderPractice(
                title = config["value"].toString().uppercase(),
                timeLeft = uiState.timeLeft,
                current = uiState.currentIdx + 1,
                total = uiState.questions.size,
                onBack = onBack
            )

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(32.dp)
            ) {
                if (uiState.isLoading) {
                    Box(modifier = Modifier.fillMaxSize().weight(1f), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(color = BrandIndigo)
                    }
                } else if (uiState.error != null) {
                    Text(uiState.error!!, color = Color.White, modifier = Modifier.align(Alignment.CenterHorizontally))
                } else if (uiState.questions.isNotEmpty()) {
                    val currentQuestion = uiState.questions[uiState.currentIdx]

                    // Progress Track
                    LinearProgressIndicator(
                        progress = (uiState.currentIdx + 1).toFloat() / uiState.questions.size,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(4.dp)
                            .background(Slate900, RoundedCornerShape(2.dp)),
                        color = BrandIndigo,
                        trackColor = Slate900
                    )

                    Surface(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(24.dp),
                        color = CardBackground,
                        border = BorderStroke(1.dp, CardBorder)
                    ) {
                        Column(modifier = Modifier.padding(24.dp)) {
                            QuestionHeaderRow(
                                difficulty = currentQuestion.difficulty ?: "Medium",
                                subject = currentQuestion.subject ?: ""
                            )
                            
                            Spacer(modifier = Modifier.height(24.dp))

                            QuestionCardNative(
                                question = currentQuestion,
                                isAnswered = uiState.isAnswered,
                                onAnswer = { viewModel.handleAnswer(it) }
                            )
                        }
                    }

                    NavigationButtons(
                        currentIdx = uiState.currentIdx,
                        total = uiState.questions.size,
                        isAnswered = uiState.isAnswered,
                        onPrev = { viewModel.handlePrev() },
                        onNext = { viewModel.handleNext() }
                    )
                    
                    Spacer(modifier = Modifier.height(32.dp))
                }
            }
        }
    }
}

@Composable
fun HeaderPractice(
    title: String,
    timeLeft: Int?,
    current: Int,
    total: Int,
    onBack: () -> Unit
) {
    Surface(
        color = Slate900,
        modifier = Modifier.fillMaxWidth(),
        border = BorderStroke(0.dp, Color.Transparent) // Border removed for cleaner look
    ) {
        Row(
            modifier = Modifier
                .padding(horizontal = 24.dp, vertical = 20.dp)
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                IconButton(
                    onClick = onBack,
                    modifier = Modifier
                        .size(40.dp)
                        .background(Slate800, RoundedCornerShape(10.dp))
                ) {
                    Icon(Icons.Default.ArrowBack, contentDescription = null, tint = Color.White, modifier = Modifier.size(18.dp))
                }
                
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("Edu", color = Color.White, fontWeight = FontWeight.Black, fontSize = 22.sp)
                    Text("In", color = BrandIndigo, fontWeight = FontWeight.Black, fontSize = 22.sp)
                }
            }

            if (timeLeft != null) {
                val mins = timeLeft / 60
                val secs = timeLeft % 60
                Surface(
                    color = if (timeLeft < 60) Color(0xFFFB7185).copy(alpha = 0.1f) else Slate800,
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, if (timeLeft < 60) Color(0xFFFB7185) else CardBorder)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Timer, 
                            contentDescription = null, 
                            tint = if (timeLeft < 60) Color(0xFFFB7185) else BrandIndigo, 
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = "%d:%02d".format(mins, secs),
                            color = Color.White,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Black,
                            letterSpacing = (-0.5).sp
                        )
                    }
                }
            }

            Column(horizontalAlignment = Alignment.End) {
                Text(
                    text = "STEP", 
                    style = MaterialTheme.typography.labelSmall, 
                    fontWeight = FontWeight.Black, 
                    color = Slate500,
                    letterSpacing = 1.sp
                )
                Text(
                    text = "$current / $total",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
            }
        }
    }
}

@Composable
fun QuestionHeaderRow(difficulty: String, subject: String) {
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        BadgeContainer(difficulty, BrandIndigo)
        if (subject.isNotEmpty()) BadgeContainer(subject, Slate500)
    }
}

@Composable
fun BadgeContainer(text: String, color: Color) {
    Surface(
        color = color.copy(alpha = 0.1f),
        shape = RoundedCornerShape(8.dp),
        border = BorderStroke(1.dp, color.copy(alpha = 0.2f))
    ) {
        Text(
            text = text.uppercase(),
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Black,
            color = color,
            letterSpacing = 1.sp
        )
    }
}

@Composable
fun QuestionCardNative(
    question: Question,
    isAnswered: Boolean,
    onAnswer: (Boolean) -> Unit
) {
    var selectedOption by remember { mutableStateOf<String?>(null) }

    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = question.questionText ?: "",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Black,
            color = Color.White,
            lineHeight = 32.sp,
            letterSpacing = (-0.5).sp
        )

        if (!question.questionImageUrl.isNullOrEmpty()) {
            Spacer(modifier = Modifier.height(24.dp))
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Slate950,
                border = BorderStroke(1.dp, CardBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                AsyncImage(
                    model = question.questionImageUrl,
                    contentDescription = "Question Image",
                    modifier = Modifier.fillMaxWidth().padding(8.dp).heightIn(max = 280.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(40.dp))

        val options = listOf(
            "A" to question.optionA,
            "B" to question.optionB,
            "C" to question.optionC,
            "D" to question.optionD
        )

        options.forEach { (key, value) ->
            val isCorrect = key == question.correctOption
            val isSelected = selectedOption == key
            
            OptionItem(
                optionKey = key,
                optionText = value ?: "",
                isAnswered = isAnswered,
                isSelected = isSelected,
                isCorrect = isCorrect,
                onClick = {
                    if (!isAnswered) {
                        selectedOption = key
                        onAnswer(isCorrect)
                    }
                }
            )
            Spacer(modifier = Modifier.height(14.dp))
        }

        if (isAnswered && !question.explanation.isNullOrEmpty()) {
            Spacer(modifier = Modifier.height(40.dp))
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                color = Slate950,
                border = BorderStroke(1.dp, CardBorder)
            ) {
                Column(modifier = Modifier.padding(24.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Timer, 
                            contentDescription = null, 
                            tint = BrandEmerald, 
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            "EXPERT ANALYSIS", 
                            fontWeight = FontWeight.Black, 
                            color = BrandEmerald, 
                            style = MaterialTheme.typography.labelSmall, 
                            letterSpacing = 2.sp
                        )
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = question.explanation, 
                        style = MaterialTheme.typography.bodyLarge, 
                        color = Color.White.copy(alpha = 0.7f), 
                        fontWeight = FontWeight.Medium,
                        lineHeight = 26.sp
                    )
                }
            }
        }
    }
}

@Composable
fun OptionItem(
    optionKey: String,
    optionText: String,
    isAnswered: Boolean,
    isSelected: Boolean,
    isCorrect: Boolean,
    onClick: () -> Unit
) {
    val borderColor = when {
        isAnswered && isCorrect -> BrandEmerald
        isAnswered && isSelected && !isCorrect -> Color(0xFFFB7185)
        isSelected -> BrandIndigo
        else -> CardBorder
    }

    val bgColor = when {
        isAnswered && isCorrect -> BrandEmerald.copy(alpha = 0.05f)
        isAnswered && isSelected && !isCorrect -> Color(0xFFFB7185).copy(alpha = 0.05f)
        isSelected -> BrandIndigo.copy(alpha = 0.05f)
        else -> Slate950
    }

    Surface(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        color = bgColor,
        border = BorderStroke(1.dp, borderColor)
    ) {
        Row(
            modifier = Modifier.padding(18.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                modifier = Modifier.size(40.dp),
                shape = RoundedCornerShape(10.dp),
                color = when {
                    isAnswered && isCorrect -> BrandEmerald
                    isAnswered && isSelected && !isCorrect -> Color(0xFFFB7185)
                    isSelected -> BrandIndigo
                    else -> Slate800
                }
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(
                        text = optionKey,
                        color = Color.White,
                        fontWeight = FontWeight.Black,
                        style = MaterialTheme.typography.titleMedium
                    )
                }
            }
            Spacer(modifier = Modifier.width(20.dp))
            Text(
                text = optionText, 
                style = MaterialTheme.typography.bodyLarge, 
                fontWeight = FontWeight.Bold, 
                color = if (isSelected || (isAnswered && isCorrect)) Color.White else Slate500
            )
        }
    }
}

@Composable
fun NavigationButtons(
    currentIdx: Int,
    total: Int,
    isAnswered: Boolean,
    onPrev: () -> Unit,
    onNext: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        TextButton(
            onClick = onPrev,
            enabled = currentIdx > 0,
            modifier = Modifier.alpha(if (currentIdx > 0) 1f else 0.3f)
        ) {
            Text(
                "PREV", 
                fontWeight = FontWeight.Black, 
                color = Color.White, 
                letterSpacing = 2.sp,
                style = MaterialTheme.typography.labelLarge
            )
        }

        Button(
            onClick = onNext,
            colors = ButtonDefaults.buttonColors(
                containerColor = if (isAnswered) BrandIndigo else Color.White,
                contentColor = if (isAnswered) Color.White else Slate950
            ),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.height(64.dp).padding(horizontal = 8.dp),
            enabled = isAnswered || currentIdx == 0 // Added some leniency or logic
        ) {
            Text(
                text = if (currentIdx == total - 1) "FINISH SESSION" else "PROCEED",
                fontWeight = FontWeight.Black,
                letterSpacing = 2.sp,
                modifier = Modifier.padding(horizontal = 24.dp)
            )
        }
    }
}
