import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import {deleteDoc, saveToFirebase} from "./helpers";
admin.initializeApp();

export const saveArticle = functions.https
    .onCall(async (data, context) => {
      const auth = context.auth;
      if (auth) {
        const uid = auth.uid;
        const articleId = data.articleId;
        const articlesRef = admin.firestore()
            .doc(`writers/${uid}/articles/${articleId}`);

        return saveToFirebase(articlesRef, data);
      }

      return Promise
          .reject(new Error("You are not authorized to access save your work"));
    });
export const likeArticle = functions.https.onCall(
    (data, context)=>{
      const article = data.article;
      const liker = data.liker;
      const articleRef = admin.firestore()
          .doc(`writers/${article.writerUid}/articles/${article.articleId}`);

      return articleRef.update({"likers": admin.firestore.FieldValue.arrayUnion(
          [liker]
      )});
    }
);

export const unlikeArticle = functions.https.onCall(
    (data, context)=>{
      const article = data.article;
      const liker = data.liker;
      const articleRef = admin.firestore()
          .doc(`writers/${article.writerUid}/articles/${article.articleId}`);

      return articleRef
          .update({"likers": admin.firestore.FieldValue.arrayRemove(
              [liker]
          )});
    }
);
export const commentOnArticle = functions.https.onCall(
    (data, context)=>{
      const article = data.article;
      const comment = data.comment;
      const articleId =article.articleId;
      const writerUid = article.writerUid;
      const path =
      `writers/${writerUid}/articles/${articleId}/comments/${comment.id}}`;
      const commentRef = admin.firestore()
          .doc(path);
      return saveToFirebase(commentRef, comment);
    }
);
export const removeCommentOnArticle = functions.https.onCall(
    (data, context)=>{
      const article = data.article;
      const comment = data.comment;
      const articleId =article.articleId;
      const writerUid = article.writerUid;
      const path =
      `writers/${writerUid}/articles/${articleId}/comments/${comment.id}}`;
      const commentRef = admin.firestore().doc(path);
      return deleteDoc(commentRef);
    }
);


export const viewArticles = functions.https.onCall(
    async (data, context)=>{
      const articlesGot :FirebaseFirestore.DocumentData[] = [];
      const uid = context.auth?.uid;
      const articles =await admin.firestore()
          .collection(`writers/${uid}/articles`).get();
      articles.docs.forEach((doc)=>{
        articlesGot.push(doc.data());
      });
      // it will be a list of document snapshots
      return articlesGot;
    }

);
