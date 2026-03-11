import { AdMob, RewardAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export const initializeAdMob = async () => {
  if (Capacitor.isNativePlatform()) {
    // Set initializeForTesting to false for production builds
    await AdMob.initialize({ initializeForTesting: false });
  }
};

export const showFinancialAdvisorAds = async (onComplete: () => void) => {
  // 1. Web Users -> Skip Ads (or handle differently)
  if (!Capacitor.isNativePlatform()) {
    onComplete();
    return;
  }

  // 2. Use your live production AdMob Ad Unit IDs
  const adId = Capacitor.getPlatform() === 'ios'
    ? 'ca-app-pub-6191158195654090/4141122574' // iOS Rewarded Ad Unit ID
    : 'ca-app-pub-6191158195654090/8634707834'; // Android Rewarded Ad Unit ID

  const playAd = async (): Promise<boolean> => {
    return new Promise(async (resolve) => {
      let resolved = false;
      const listener = await AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
        if (!resolved) { resolved = true; resolve(true); }
        listener.remove();
      });
      // Handle closing without watching
      const closeListener = await AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
         if (!resolved) { resolved = true; resolve(false); }
         closeListener.remove();
      });

      try {
        await AdMob.prepareRewardVideoAd({ adId });
        await AdMob.showRewardVideoAd();
      } catch (e) {
        console.error(e);
        resolve(true); // Fallback: let them pass if ad fails
      }
    });
  };

  // 3. Play First Ad
  const firstSuccess = await playAd();
  if (firstSuccess) {
    // 4. Alert: "One more step..."
    alert("Analyzing financial data... Watch 1 more short video to unlock your full report.");
    
    // 5. Play Second Ad
    const secondSuccess = await playAd();
    if (secondSuccess) {
      onComplete(); // Unlock the AI
    }
  }
};
