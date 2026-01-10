import pandas as pd

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["Temp_diff"] = df["Process temperature [K]"] - df["Air temperature [K]"]
    df["Power_proxy"] = df["Torque [Nm]"] * df["Rotational speed [rpm]"]

    df["Wear_bucket"] = pd.cut(
        df["Tool wear [min]"],
        bins=[-1, 80, 160, 300],
        labels=["Low", "Medium", "High"]
    )
    return df
