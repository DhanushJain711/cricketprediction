# cricketprediction
A machine learning model trained to predict the final scores of T20 cricket innings.

Data: I used ball-by-ball data from thousands of T20I matches, found here: [[data]](https://cricsheet.org/matches/)
The data for each match came in seperate csv files. Each csv file contained columns for runs scored, wickets fallen, extras, etc. for each ball of the match. I used a python script to combine all the csvs into one large csv (combinecsv.py). I then loaded this combined csv into Jupyter Notebook to process it (dataprocessing.ipynb). Processing involved cleaning the dataset, as well as engineering more features for training such as run rate, strike rate, etc. I then exported this new dataset for use in training (the csv file was too large to upload to the respository)

Training: I trained a simple feedforward neural network on the data (neuralnet.ipynb). My first result was a mean absolute error (MAE) in runs of around 19.8, meaning the prediction was on average 19.8 runs off from the actual final score. I noticed that my network only trained for around 30 epochs, before it stopped due to increase in validation loss (overfitting). However, when I tried to implement some overfitting management techniques in the next iteration (L1/L2 regularization, dropout, learning rate scheduling), my MAE actually increased to around 23 (worse performance). Thus, the overfitting prevention actually made the model too general. So, I reverted the model back to its original form, only keeping batch normalization layers in the network. It was finally able to achieve an MAE of around 19.5.

I also tested some other models on the task (othermodels.ipynb). A simple Linear Regressor achieved an MAE of 21.26, and a Gradient Boosting Regressor achieved an MAE of 20.21. Ultimately, the NN performed better, but only marginally.

Further work: The accuracy of the model can be definitely improved. An analysis of feature importance shows an overwhelming importance of run rate, so boosting this feature and removing other less important features may improve accuracy and reduce overfitting. Other models, such as XGBoost (a more robust gradient booster) may be more accurate. Because cricket is a sequential game, models that train on temporal data, such as an LSTM network, may also be powerful for the task. Of course, more data can also be used for extended training to improve accuracy (data from domestic leagues like the IPL, in addition to T20Is)

This project was completed for the sole purpose of learning more about training and testing neural networks.
