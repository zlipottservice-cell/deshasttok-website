package com.example.eduin.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.foundation.Image
import androidx.compose.ui.res.painterResource
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.border
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import com.example.eduin.ui.theme.*
import com.example.eduin.ui.viewmodel.SetupViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SetupScreen(
    type: String,
    value: String,
    onBack: () -> Unit,
    onStart: (Map<String, Any>) -> Unit,
    viewModel: SetupViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(type, value) {
        viewModel.loadConfig(type, value)
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(AppBackground)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp)
                .verticalScroll(rememberScrollState())
        ) {
            Spacer(modifier = Modifier.height(32.dp))

            IconButton(
                onClick = onBack,
                modifier = Modifier
                    .size(48.dp)
                    .background(Slate900, RoundedCornerShape(12.dp))
                    .border(1.dp, CardBorder, RoundedCornerShape(12.dp))
            ) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
            }

            Spacer(modifier = Modifier.height(32.dp))

            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Edu",
                    style = MaterialTheme.typography.displaySmall,
                    fontWeight = FontWeight.Black,
                    color = Color.White,
                    letterSpacing = (-1).sp
                )
                Text(
                    text = "In",
                    style = MaterialTheme.typography.displaySmall,
                    fontWeight = FontWeight.Black,
                    color = BrandIndigo,
                    letterSpacing = (-1).sp
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "Session\nConfiguration",
                style = MaterialTheme.typography.displaySmall,
                fontWeight = FontWeight.Black,
                color = Color.White,
                letterSpacing = (-1).sp,
                lineHeight = 36.sp
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "$type: $value".uppercase(),
                style = MaterialTheme.typography.labelLarge,
                fontWeight = FontWeight.Black,
                color = BrandIndigo,
                letterSpacing = 2.sp
            )

            Spacer(modifier = Modifier.height(48.dp))

            if (uiState.isLoading) {
                Box(
                    modifier = Modifier.fillMaxWidth().height(200.dp),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = BrandIndigo)
                }
            } else {
                Column(verticalArrangement = Arrangement.spacedBy(40.dp)) {
                    // Subject & Chapter
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(16.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Box(modifier = Modifier.weight(1f)) {
                            SetupDropdown(
                                label = "MODULE",
                                options = uiState.subjects,
                                selectedOption = uiState.selectedSubject,
                                onOptionSelected = { viewModel.onSubjectSelected(it) }
                            )
                        }
                    }

                    SetupDropdown(
                        label = "FOCAL SEGMENT",
                        options = listOf("All Chapters") + uiState.chapters,
                        selectedOption = uiState.selectedChapter,
                        onOptionSelected = { viewModel.onChapterSelected(it) }
                    )

                    // Difficulty
                    SetupOptionGroup(
                        label = "INTENSITY LEVEL",
                        options = listOf("Easy", "Medium", "Hard"),
                        selectedOption = uiState.difficulty,
                        onOptionSelected = { viewModel.onDifficultySelected(it) }
                    )

                    // Question Count
                    SetupNumberSelector(
                        label = "TARGET VOLUME",
                        value = uiState.questionCount,
                        onValueChange = { viewModel.onQuestionCountSelected(it) }
                    )

                    Spacer(modifier = Modifier.height(24.dp))

                    Button(
                        onClick = {
                            onStart(
                                mapOf(
                                    "type" to type,
                                    "value" to value,
                                    "difficulty" to uiState.difficulty,
                                    "limit" to uiState.questionCount,
                                    "timeLimit" to uiState.timeLimit,
                                    "subject" to uiState.selectedSubject,
                                    "chapter" to uiState.selectedChapter
                                )
                            )
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(72.dp),
                        shape = RoundedCornerShape(20.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = BrandIndigo,
                            contentColor = Color.White
                        )
                    ) {
                        Text(
                            "INITIALIZE SESSION",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = 2.sp
                        )
                    }
                }
            }
            Spacer(modifier = Modifier.height(48.dp))
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SetupDropdown(
    label: String,
    options: List<String>,
    selectedOption: String,
    onOptionSelected: (String) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }

    Column {
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Black,
            color = Slate500,
            letterSpacing = 1.sp
        )
        Spacer(modifier = Modifier.height(12.dp))
        ExposedDropdownMenuBox(
            expanded = expanded,
            onExpandedChange = { expanded = !expanded }
        ) {
            OutlinedTextField(
                value = selectedOption,
                onValueChange = {},
                readOnly = true,
                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
                modifier = Modifier
                    .fillMaxWidth()
                    .menuAnchor(),
                shape = RoundedCornerShape(16.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    unfocusedBorderColor = CardBorder,
                    focusedBorderColor = BrandIndigo,
                    unfocusedTextColor = Color.White,
                    focusedTextColor = Color.White,
                    unfocusedContainerColor = CardBackground,
                    focusedContainerColor = CardBackground
                ),
                textStyle = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Bold)
            )
            ExposedDropdownMenu(
                expanded = expanded,
                onDismissRequest = { expanded = false },
                modifier = Modifier.background(CardBackground).border(1.dp, CardBorder)
            ) {
                options.forEach { option ->
                    DropdownMenuItem(
                        text = { Text(option, color = Color.White, fontWeight = FontWeight.Bold) },
                        onClick = {
                            onOptionSelected(option)
                            expanded = false
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun SetupOptionGroup(
    label: String,
    options: List<String>,
    selectedOption: String,
    onOptionSelected: (String) -> Unit
) {
    Column {
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Black,
            color = Slate500,
            letterSpacing = 1.sp
        )
        Spacer(modifier = Modifier.height(12.dp))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            options.forEach { option ->
                val isSelected = option == selectedOption
                Surface(
                    modifier = Modifier
                        .weight(1f)
                        .clickable { onOptionSelected(option) },
                    shape = RoundedCornerShape(16.dp),
                    color = if (isSelected) BrandIndigo else CardBackground,
                    border = BorderStroke(1.dp, if (isSelected) BrandIndigo else CardBorder)
                ) {
                    Box(
                        modifier = Modifier.padding(vertical = 16.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = option.uppercase(),
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Black,
                            color = if (isSelected) Color.White else Slate500
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun SetupNumberSelector(
    label: String,
    value: Int,
    onValueChange: (Int) -> Unit
) {
    Column {
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Black,
            color = Slate500,
            letterSpacing = 1.sp
        )
        Spacer(modifier = Modifier.height(12.dp))
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(CardBackground, RoundedCornerShape(16.dp))
                .border(1.dp, CardBorder, RoundedCornerShape(16.dp))
                .padding(8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = { if (value > 5) onValueChange(value - 5) },
                modifier = Modifier.size(48.dp).background(Slate800, RoundedCornerShape(12.dp))
            ) {
                Text("-", color = Color.White, fontWeight = FontWeight.Black, fontSize = 24.sp)
            }
            
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = value.toString(),
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
                Text(
                    text = "QUESTIONS",
                    style = MaterialTheme.typography.labelSmall,
                    color = Slate500,
                    fontWeight = FontWeight.Black
                )
            }

            IconButton(
                onClick = { if (value < 100) onValueChange(value + 5) },
                modifier = Modifier.size(48.dp).background(Slate800, RoundedCornerShape(12.dp))
            ) {
                Text("+", color = Color.White, fontWeight = FontWeight.Black, fontSize = 24.sp)
            }
        }
    }
}
