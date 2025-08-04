/**
 * Inventory system for tracking collected trays and player progression.
 */
class InventorySystem {
    constructor() {
        this.storageKey = 'tempGameInventory';
        this.loadInventory();
    }
    
    loadInventory() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                this.data = JSON.parse(saved);
                // Add new properties if they don't exist (for backwards compatibility)
                if (!this.data.failedCooks) this.data.failedCooks = [];
                if (typeof this.data.totalFailures !== 'number') this.data.totalFailures = 0;
                if (typeof this.data.cash !== 'number') this.data.cash = 0;
            } else {
                this.data = {
                    trays: [],
                    failedCooks: [],
                    totalGames: 0,
                    totalFailures: 0,
                    bestScore: 0,
                    totalTrays: 0,
                    cash: 0
                };
            }
        } catch (error) {
            console.error('Error loading inventory:', error);
            // Reset to default if corrupted
            this.data = {
                trays: [],
                failedCooks: [],
                totalGames: 0,
                totalFailures: 0,
                bestScore: 0,
                totalTrays: 0,
                cash: 0
            };
        }
    }
    
    saveInventory() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            console.log('Inventory saved:', this.data); // Debug log
        } catch (error) {
            console.error('Error saving inventory:', error);
        }
    }
    
    getQualityRating(score) {
        if (score >= 90) return "Amazing";
        if (score >= 80) return "Excellent"; 
        if (score >= 70) return "Great";
        if (score >= 50) return "Good";
        if (score >= 30) return "Average";
        return "Poor";
    }
    
    getQualityColor(quality) {
        const colors = {
            "Amazing": "#FFD700",    // Gold
            "Excellent": "#FF6B35",  // Orange-red
            "Great": "#4CAF50",      // Green
            "Good": "#2196F3",       // Blue
            "Average": "#FF9800",    // Orange
            "Poor": "#9E9E9E",       // Gray
            "Failed": "#8B0000"      // Dark red
        };
        return colors[quality] || "#9E9E9E";
    }
    
    getQualityEmoji(quality) {
        const emojis = {
            "Amazing": "🏆",
            "Excellent": "🥇",
            "Great": "🥈", 
            "Good": "🥉",
            "Average": "📋",
            "Poor": "📄",
            "Failed": "❌"
        };
        return emojis[quality] || "📄";
    }
    
    getTrayCount(score) {
        if (score >= 80) return 3;
        if (score >= 60) return 2;
        if (score >= 30) return 1;
        return 1; // Even poor performance gets 1 tray for participation
    }
    
    addGameResult(finalScore, hasFailed = false, failureReason = null) {
        const timestamp = Date.now();
        
        console.log(`🎮 ADDING GAME RESULT:`);
        console.log(`   Score: ${finalScore}%`);
        console.log(`   Failed: ${hasFailed}`);
        console.log(`   Reason: ${failureReason}`);
        
        // CRITICAL: Ensure failed cooks NEVER get trays
        if (hasFailed === true) {
            console.log(`❌ PROCESSING FAILED COOK - NO TRAYS AWARDED`);
            
            // Add failed cook
            const failedCook = {
                score: finalScore,
                reason: failureReason,
                timestamp: timestamp,
                gameNumber: this.data.totalGames + 1
            };
            
            this.data.failedCooks.push(failedCook);
            this.data.totalFailures++;
            
            console.log('   ❌ Added failed cook:', failedCook);
            console.log(`   📊 Total failures now: ${this.data.totalFailures}`);
            
            // Update total games
            this.data.totalGames++;
            this.saveInventory();
            
            // Return failure result with NO trays
            const result = {
                failed: true,
                reason: failureReason,
                score: finalScore,
                traysEarned: 0  // Explicitly 0 trays
            };
            
            console.log(`   🔄 Returning failure result:`, result);
            return result;
            
        } else {
            console.log(`✅ PROCESSING SUCCESSFUL COOK - AWARDING TRAYS`);
            
            // Add successful cook with trays
            const quality = this.getQualityRating(finalScore);
            const trayCount = this.getTrayCount(finalScore);
            
            console.log(`   🏆 Quality: ${quality}`);
            console.log(`   🍽️ Trays to award: ${trayCount}`);
            
            for (let i = 0; i < trayCount; i++) {
                this.data.trays.push({
                    quality: quality,
                    score: finalScore,
                    timestamp: timestamp + i, // Slight offset to avoid duplicate timestamps
                    gameNumber: this.data.totalGames + 1
                });
            }
            
            this.data.totalTrays += trayCount;
            this.data.bestScore = Math.max(this.data.bestScore, finalScore);
            
            // Update total games
            this.data.totalGames++;
            this.saveInventory();
            
            // Return success result
            const result = {
                failed: false,
                traysEarned: trayCount,
                quality: quality,
                newBestScore: finalScore >= this.data.bestScore
            };
            
            console.log(`   🔄 Returning success result:`, result);
            return result;
        }
    }
    
    getStats() {
        const qualityCounts = {};
        this.data.trays.forEach(tray => {
            qualityCounts[tray.quality] = (qualityCounts[tray.quality] || 0) + 1;
        });
        
        // Count failure reasons
        const failureReasons = {};
        this.data.failedCooks.forEach(failure => {
            failureReasons[failure.reason] = (failureReasons[failure.reason] || 0) + 1;
        });
        
        const successfulGames = this.data.totalGames - this.data.totalFailures;
        const successRate = this.data.totalGames > 0 ? 
            Math.round((successfulGames / this.data.totalGames) * 100) : 0;
        
        return {
            totalTrays: this.data.totalTrays,
            totalGames: this.data.totalGames,
            totalFailures: this.data.totalFailures,
            successfulGames: successfulGames,
            successRate: successRate,
            bestScore: this.data.bestScore,
            qualityCounts: qualityCounts,
            failureReasons: failureReasons,
            averageScore: this.data.trays.length > 0 ? 
                Math.round(this.data.trays.reduce((sum, tray) => sum + tray.score, 0) / this.data.trays.length) : 0
        };
    }
    
    getRecentTrays(count = 10) {
        return this.data.trays
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, count);
    }
    
    getRecentFailures(count = 5) {
        return this.data.failedCooks
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, count);
    }
    
    getRecentActivity(count = 10) {
        // Combine trays and failures, sort by timestamp
        const activity = [
            ...this.data.trays.map(tray => ({...tray, type: 'success'})),
            ...this.data.failedCooks.map(failure => ({...failure, type: 'failure', quality: 'Failed'}))
        ];
        
        console.log('Recent activity data:', activity); // Debug log
        
        return activity
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, count);
    }
    
    clearInventory() {
        this.data = {
            trays: [],
            failedCooks: [],
            totalGames: 0,
            totalFailures: 0,
            bestScore: 0,
            totalTrays: 0,
            cash: 0
        };
        this.saveInventory();
    }
    
    exportData() {
        return JSON.stringify(this.data, null, 2);
    }
    
    importData(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            if (imported.trays && Array.isArray(imported.trays)) {
                this.data = imported;
                // Ensure new properties exist
                if (!this.data.failedCooks) this.data.failedCooks = [];
                if (typeof this.data.totalFailures !== 'number') this.data.totalFailures = 0;
                if (typeof this.data.cash !== 'number') this.data.cash = 0;
                this.saveInventory();
                return true;
            }
        } catch (e) {
            console.error('Failed to import data:', e);
        }
        return false;
    }
    
    /**
     * Get the current cash amount
     */
    getCash() {
        return this.data.cash || 0;
    }
    
    /**
     * Calculate the value of a tray based on its quality
     */
    getTrayValue(quality) {
        const values = {
            "Amazing": 50,
            "Excellent": 40,
            "Great": 30,
            "Good": 20,
            "Average": 15,
            "Poor": 10
        };
        return values[quality] || 5;
    }
    
    /**
     * Sell all trays for cash
     */
    sellAllTrays() {
        let totalValue = 0;
        
        // Calculate total value of all trays
        this.data.trays.forEach(tray => {
            totalValue += this.getTrayValue(tray.quality);
        });
        
        // Add cash to inventory
        this.data.cash += totalValue;
        
        // Clear all trays
        this.data.trays = [];
        this.data.totalTrays = 0;
        
        // Save the updated inventory
        this.saveInventory();
        
        console.log(`Sold all trays for ${totalValue} cash. New total: ${this.data.cash}`);
        
        return totalValue;
    }
} 