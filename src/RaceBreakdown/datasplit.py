import pandas as pd

data = pd.read_csv("test.csv")
race = ["Caucasian", "Asian American", "African American", "Hispanic", "Native American", "Hawaiian/Pacific Isl", "International", "Unknown.1", "All African American", "All Native American", "All Hawaiian/ Pac Isl", "All Asian"]

colleges = data['College'].unique()
for college in colleges:
    major_totals = data[data['College'] == college]
    years = data['Fall'].unique()
    for year in years:
        mainframe = major_totals
        year_data = major_totals[major_totals['Fall'] == year]
        for i in race:
            year_data = year_data.groupby(['Major Name'])[i].sum()
        mainframe.join(year_data)
        csv_name = str(year) + '-' + college + '-rb.csv'
        year_data = year_data.to_frame()
        year_data.to_csv(csv_name)
