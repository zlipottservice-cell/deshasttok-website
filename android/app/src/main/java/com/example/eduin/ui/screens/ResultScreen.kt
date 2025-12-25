package com.example.eduin.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.ui.res.painterResource
import androidx.compose.foundation.background
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import com.example.eduin.ui.theme.*

@Composable
fun ResultScreen(
    results: Map<String, Any>,
    onRestart: () -> Unit,
    onHome: () -> Unit
) {
    val total = results["total"] as? Int ?: 0
    val correct = results["correct"] as? Int ?: 0
    val wrong = results["wrong"] as? Int ?: 0
    val skipped = results["skipped"] as? Int ?: 0
    
    val accuracy = if (correct + wrong > 0) (correct * 100) / (correct + wrong) else 0

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(AppBackground)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(64.dp))

            Surface(
                modifier = Modifier.size(96.dp),
                shape = RoundedCornerShape(28.dp),
                color = BrandEmerald,
                shadowElevation = 0.dp
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text("✓", color = Color.White, fontSize = 44.sp, fontWeight = FontWeight.Black)
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Edu",
                    style = MaterialTheme.typography.displayMedium,
                    fontWeight = FontWeight.Black,
                    color = Color.White,
                    letterSpacing = (-1).sp
                )
                Text(
                    text = "In",
                    style = MaterialTheme.typography.displayMedium,
                    fontWeight = FontWeight.Black,
                    color = BrandIndigo,
                    letterSpacing = (-1).sp
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Performance\nSummary",
                color = Color.White,
                style = MaterialTheme.typography.displaySmall,
                fontWeight = FontWeight.Black,
                textAlign = TextAlign.Center,
                letterSpacing = (-1).sp,
                lineHeight = 36.sp
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "SESSION TERMINATED SUCCESSFULLY",
                color = BrandIndigo,
                style = MaterialTheme.typography.labelSmall,
                fontWeight = FontWeight.Black,
                letterSpacing = 2.sp
            )

            Spacer(modifier = Modifier.height(48.dp))

            // Stats Card
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = CardBackground,
                shape = RoundedCornerShape(24.dp),
                border = BorderStroke(1.dp, CardBorder)
            ) {
                Column(modifier = Modifier.padding(24.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        ResultStatPill("VOLUME", total, Color.White, Modifier.weight(1f))
                        ResultStatPill("ACCURATE", correct, BrandEmerald, Modifier.weight(1f))
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        ResultStatPill("ERRORS", wrong, Color(0xFFFB7185), Modifier.weight(1f))
                        ResultStatPill("PASSED", skipped, Slate500, Modifier.weight(1f))
                    }

                    Spacer(modifier = Modifier.height(32.dp))

                    // Accuracy Section
                    Surface(
                        modifier = Modifier.fillMaxWidth(),
                        color = Slate950,
                        shape = RoundedCornerShape(20.dp),
                        border = BorderStroke(1.dp, CardBorder)
                    ) {
                        Row(
                            modifier = Modifier.padding(24.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                Text(
                                    text = "EFFICIENCY INDEX", 
                                    style = MaterialTheme.typography.labelSmall, 
                                    fontWeight = FontWeight.Black, 
                                    color = Slate500, 
                                    letterSpacing = 1.sp
                                )
                                Text(
                                    text = "$accuracy%", 
                                    style = MaterialTheme.typography.displaySmall, 
                                    fontWeight = FontWeight.Black, 
                                    color = Color.White,
                                    letterSpacing = (-1).sp
                                )
                            }
                            CircularProgressIndicator(
                                progress = accuracy / 100f,
                                modifier = Modifier.size(64.dp),
                                color = if (accuracy > 70) BrandEmerald else BrandIndigo,
                                strokeWidth = 8.dp,
                                trackColor = Slate900
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(48.dp))

            Button(
                onClick = onRestart,
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
                    "RE-INITIALIZE", 
                    fontWeight = FontWeight.Black, 
                    letterSpacing = 2.sp,
                    fontSize = 16.sp
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            OutlinedButton(
                onClick = onHome,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(64.dp),
                shape = RoundedCornerShape(20.dp),
                border = BorderStroke(1.dp, CardBorder),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = Slate500)
            ) {
                Text(
                    "EXIT TO DASHBOARD", 
                    fontWeight = FontWeight.Black, 
                    letterSpacing = 2.sp
                )
            }
            
            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}

@Composable
fun ResultStatPill(label: String, value: Int, color: Color, modifier: Modifier = Modifier) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        color = Slate950,
        border = BorderStroke(1.dp, CardBorder)
    ) {
        Column(
            modifier = Modifier.padding(vertical = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = label, 
                style = MaterialTheme.typography.labelSmall, 
                fontWeight = FontWeight.Black, 
                color = Slate500, 
                letterSpacing = 1.sp
            )
            Text(
                text = value.toString(), 
                style = MaterialTheme.typography.headlineMedium, 
                fontWeight = FontWeight.Black, 
                color = color
            )
        }
    }
}
