import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import joblib

from features import engineer_features
import config

def main():
    df = pd.read_csv(config.DATA_PATH)
    df["Timestamp"] = pd.to_datetime(df["Timestamp"])
    df = engineer_features(df)

    df = df.sort_values("Timestamp")
    split_idx = int(len(df) * config.TRAIN_SPLIT_RATIO)

    train_df = df.iloc[:split_idx]
    test_df = df.iloc[split_idx:]

    X_train = train_df.drop(columns=[config.TARGET_COL , "Timestamp"])
    y_train = train_df[config.TARGET_COL]
    X_test = test_df.drop(columns=[config.TARGET_COL , "Timestamp"])
    y_test = test_df[config.TARGET_COL]

    categorical_cols = X_train.select_dtypes(include=["object", "category"]).columns
    numeric_cols = X_train.select_dtypes(exclude=["object", "category"]).columns

    preprocessor = ColumnTransformer([
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols),
        ("num", "passthrough", numeric_cols)
    ])

    lr = Pipeline([
        ("preprocess", preprocessor),
        ("model", LogisticRegression(max_iter=1000))
    ])

    lr.fit(X_train, y_train)
    preds = lr.predict(X_test)
    probs = lr.predict_proba(X_test)[:, 1]

    print("=== Logistic Regression ===")
    print(confusion_matrix(y_test, preds))
    print(classification_report(y_test, preds))
    print("ROC-AUC:", roc_auc_score(y_test, probs))

    rf = Pipeline([
        ("preprocess", preprocessor),
        ("model", RandomForestClassifier(
            n_estimators=200,
            random_state=config.RANDOM_STATE,
            class_weight="balanced"
        ))
    ])

    rf.fit(X_train, y_train)
    preds = rf.predict(X_test)
    probs = rf.predict_proba(X_test)[:, 1]

    print("=== Random Forest ===")
    print(confusion_matrix(y_test, preds))
    print(classification_report(y_test, preds))
    print("ROC-AUC:", roc_auc_score(y_test, probs))

    joblib.dump(rf, "model.pkl")
    
if __name__ == "__main__":
    main()
