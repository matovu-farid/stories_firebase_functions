import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

import {saveToFirebase} from "./helpers";

export const uploadToTimelines = functions.https.onCall(
    async (data, context) => {
      const uid = context.auth?.uid;
      const promises : Promise<any>[] = [];
      const followersSnapshot = await admin.firestore()
          .collection(`writers/${uid}/followers`).get();
      if (followersSnapshot.docs.length>0) {
        followersSnapshot.forEach((doc) => {
          const uid = doc.id;
          const timelineRef = admin.firestore()
              .doc(`readers/${uid}/timeline/${data.articleId}`);
          promises.push(saveToFirebase(timelineRef, data));
        });
      }
      return await Promise.all(promises);
    }
);
