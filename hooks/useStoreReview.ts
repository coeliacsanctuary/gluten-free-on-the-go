import { useCallback } from "react";
import { InteractionManager } from "react-native";
import * as StoreReview from "expo-store-review";
import {
  shouldShowReviewPrompt,
  markPromptShown,
} from "@/services/storeReview";

export function useStoreReview() {
  const triggerReviewCheck = useCallback(() => {
    InteractionManager.runAfterInteractions(async () => {
      const available = await StoreReview.isAvailableAsync();

      if (!available) {
        return;
      }

      const should = await shouldShowReviewPrompt();

      if (!should) {
        return;
      }

      setTimeout(async () => {
        await StoreReview.requestReview();
        await markPromptShown();
      }, 1500);
    });
  }, []);

  return { triggerReviewCheck };
}
