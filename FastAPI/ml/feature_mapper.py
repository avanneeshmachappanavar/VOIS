def map_operator_to_ml(data: dict):
    return {
        # Sensor-like inputs
        "Air temperature [K]": data["temperature"] + 273.15,
        "Process temperature [K]": data["temperature"] + 280,
        "Rotational speed [rpm]": 1800,
        "Torque [Nm]": 50,
        "Tool wear [min]": int(data["mileage"] / 1000),

        # Categorical inputs
        "Type": "L",
        "Product ID": "M12345",

        # FAILURE SUBTYPE FLAGS (MUST EXIST)
        "TWF": 1,
        "HDF": 0,
        "PWF": 0,
        "OSF": 0,
        "RNF": 0,
    }
