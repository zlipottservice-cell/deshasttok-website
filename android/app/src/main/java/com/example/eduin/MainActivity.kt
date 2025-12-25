package com.example.eduin

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.compose.runtime.remember
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.eduin.ui.screens.*
import com.example.eduin.ui.theme.EduinTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            EduinTheme {
                val navController = rememberNavController()
                
                NavHost(navController = navController, startDestination = "home") {
                    composable("home") {
                        HomeScreen(onSelection = { type, value ->
                            navController.navigate("setup/$type/$value")
                        })
                    }
                    
                    composable(
                        "setup/{type}/{value}",
                        arguments = listOf(
                            navArgument("type") { type = NavType.StringType },
                            navArgument("value") { type = NavType.StringType }
                        )
                    ) { backStackEntry ->
                        val type = backStackEntry.arguments?.getString("type") ?: ""
                        val value = backStackEntry.arguments?.getString("value") ?: ""
                        SetupScreen(
                            type = type,
                            value = value,
                            onBack = { navController.popBackStack() },
                            onStart = { config ->
                                // Using a simple way to pass config for now, 
                                // in a real app would use a shared ViewModel or SavedStateHandle
                                val configJson = com.google.gson.Gson().toJson(config)
                                navController.navigate("practice/$configJson")
                            }
                        )
                    }
                    
                    composable(
                        "practice/{config}",
                        arguments = listOf(navArgument("config") { type = NavType.StringType })
                    ) { backStackEntry ->
                        val configJson = backStackEntry.arguments?.getString("config") ?: ""
                        val typeToken = object : com.google.gson.reflect.TypeToken<Map<String, Any>>() {}.type
                        val config: Map<String, Any> = com.google.gson.Gson().fromJson(configJson, typeToken)
                        
                        PracticeScreen(
                            config = config,
                            onBack = { navController.popBackStack() },
                            onComplete = { results ->
                                val resultsJson = com.google.gson.Gson().toJson(results)
                                navController.navigate("result/$resultsJson") {
                                    popUpTo("home") // Clear backstack
                                }
                            }
                        )
                    }
                    
                    composable(
                        "result/{results}",
                        arguments = listOf(navArgument("results") { type = NavType.StringType })
                    ) { backStackEntry ->
                        val resultsJson = backStackEntry.arguments?.getString("results") ?: ""
                        val typeToken = object : com.google.gson.reflect.TypeToken<Map<String, Any>>() {}.type
                        val results: Map<String, Any> = com.google.gson.Gson().fromJson(resultsJson, typeToken)
                        
                        ResultScreen(
                            results = results,
                            onRestart = { navController.popBackStack() },
                            onHome = { navController.navigate("home") { popUpTo("home") { inclusive = true } } }
                        )
                    }
                }
            }
        }
    }
}