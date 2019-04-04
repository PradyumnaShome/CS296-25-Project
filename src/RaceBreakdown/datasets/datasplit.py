import pandas as pd

data = pd.read_csv("cleaned.csv")
race = ["Asian American", "African American", "Hispanic", "Native American", "Hawaiian/Pacific Isl", "International", "Unknown.1", "All African American", "All Native American", "All Hawaiian/ Pac Isl", "All Asian"]


colleges = data['College'].unique()

for college in colleges:
    major_totals = data[data['College'] == college]
    years = data['Fall'].unique()
    for year in years:
        year_data = major_totals[major_totals['Fall'] == year]
        blank = year_data.groupby(['Major Name'])["Caucasian"].sum().to_frame()
        for i in race:
            temp_data = pd.DataFrame(year_data.groupby(['Major Name'])[i].sum())
            blank = blank.join(temp_data)
        csv_name = str(year) + '-' + college + '-rb.csv'
        blank.to_csv(csv_name)
