import AsyncStorage from "@react-native-async-storage/async-storage";

const LIFETIME_VIEWS_KEY = "@review/lifetime-views";
const LAST_SHOWN_KEY = "@review/last-shown";

const MINIMUM_VIEWS = 2;
const COOLDOWN_DAYS = 14;

export async function incrementLifetimeViews(): Promise<number> {
  const stored = await AsyncStorage.getItem(LIFETIME_VIEWS_KEY);
  const current = stored ? parseInt(stored, 10) : 0;
  const next = current + 1;

  await AsyncStorage.setItem(LIFETIME_VIEWS_KEY, String(next));

  return next;
}

export async function shouldShowReviewPrompt(): Promise<boolean> {
  const stored = await AsyncStorage.getItem(LIFETIME_VIEWS_KEY);
  const views = stored ? parseInt(stored, 10) : 0;

  if (views < MINIMUM_VIEWS) {
    return false;
  }

  const lastShown = await AsyncStorage.getItem(LAST_SHOWN_KEY);

  if (!lastShown) {
    return true;
  }

  const daysSinceLast =
    (Date.now() - new Date(lastShown).getTime()) / (1000 * 60 * 60 * 24);

  return daysSinceLast >= COOLDOWN_DAYS;
}

export async function markPromptShown(): Promise<void> {
  await AsyncStorage.setItem(LAST_SHOWN_KEY, new Date().toISOString());
}
