import { AdMob, RewardAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export const initializeAdMob = async () => {
  if (Capacitor.isNativePlatform()) {
    await AdMob.initialize({ initializeForTesting: true });
  }
};

export const showFinancialAdvisorAds = async (onComplete: () => void) => {
  // 1. Web Users -> Skip Ads (or handle differently)
  if (!Capacitor.isNativePlatform()) {
    onComplete();
    return;
  }

  // 2. Test IDs (Replace with Real IDs before Launch)
  const adId = Capacitor.getPlatform() === 'ios'
    ? 'ca-app-pub-3940256099942544/1712485313'
    : 'ca-app-pub-3940256099942544/5224354917';

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