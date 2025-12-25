package com.example.eduin.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.foundation.Image
import androidx.compose.ui.res.painterResource
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.BorderStroke
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import com.example.eduin.ui.theme.*

@Composable
fun HomeScreen(
    onSelection: (String, String) -> Unit
) {
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
            
            HeaderSection()

            Spacer(modifier = Modifier.height(64.dp))

            HeroSection()

            Spacer(modifier = Modifier.height(64.dp))

            Text(
                text = "COMPETITIVE TRACK",
                style = MaterialTheme.typography.labelLarge,
                fontWeight = FontWeight.Black,
                color = Slate500,
                letterSpacing = 2.sp,
                modifier = Modifier.padding(bottom = 24.dp)
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(20.dp)
            ) {
                listOf("JEE", "NEET").forEach { exam ->
                    ExamCard(
                        name = exam,
                        modifier = Modifier.weight(1f),
                        onClick = { onSelection("exam", exam) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(56.dp))

            Text(
                text = "ACADEMIC MASTERY",
                style = MaterialTheme.typography.labelLarge,
                fontWeight = FontWeight.Black,
                color = Slate500,
                letterSpacing = 2.sp,
                modifier = Modifier.padding(bottom = 24.dp)
            )

            val classes = listOf("12", "11", "10", "9", "8", "7", "6", "5")
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
                modifier = Modifier.heightIn(max = 1000.dp)
            ) {
                items(classes) { cls ->
                    ClassCard(
                        className = cls,
                        onClick = { onSelection("class", cls) }
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(64.dp))
        }
    }
}

@Composable
fun HeaderSection() {
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
}

@Composable
fun HeroSection() {
    Column {
        Text(
            text = "Professional\nPractice Portal.",
            style = MaterialTheme.typography.displayMedium,
            fontWeight = FontWeight.Black,
            color = Color.White,
            lineHeight = 48.sp,
            letterSpacing = (-1).sp
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "Curated modules for high-performance learning.",
            style = MaterialTheme.typography.bodyLarge,
            color = Slate500,
            fontWeight = FontWeight.Medium
        )
    }
}

@Composable
fun ExamCard(
    name: String,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Surface(
        modifier = modifier
            .height(220.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(24.dp),
        color = CardBackground,
        border = BorderStroke(1.dp, CardBorder)
    ) {
        Column(
            modifier = Modifier.padding(24.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Box(
                modifier = Modifier
                    .size(56.dp)
                    .background(Slate800.copy(alpha = 0.5f), RoundedCornerShape(16.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = if (name == "JEE") Icons.Default.Bolt else Icons.Default.Book,
                    contentDescription = null,
                    tint = if (name == "JEE") Color(0xFFFFCC00) else BrandIndigo,
                    modifier = Modifier.size(28.dp)
                )
            }
            
            Column {
                Text(
                    text = name,
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "START SESSION",
                    style = MaterialTheme.typography.labelSmall,
                    color = BrandIndigo,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.sp
                )
            }
        }
    }
}

@Composable
fun ClassCard(
    className: String,
    onClick: () -> Unit
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(20.dp),
        color = CardBackground,
        border = BorderStroke(1.dp, CardBorder)
    ) {
        Column(
            modifier = Modifier.padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = className,
                style = MaterialTheme.typography.headlineLarge,
                fontWeight = FontWeight.Black,
                color = Color.White
            )
            Text(
                text = "GRADE $className",
                style = MaterialTheme.typography.labelSmall,
                fontWeight = FontWeight.Black,
                color = Slate500,
                letterSpacing = 1.sp
            )
        }
    }
}
