import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import tensorflow.keras

IMG_SIZE = (224,224)
BATCH = 16
EPOCHS = 10
TRAIN_DIR = 'data/train'
VAL_DIR = 'data/val'
NUM_CLASSES = 3  # set to your number of labels

train_gen = ImageDataGenerator(rescale=1./255, rotation_range=10, width_shift_range=.1, height_shift_range=.1, horizontal_flip=True)
val_gen = ImageDataGenerator(rescale=1./255)

train_ds = train_gen.flow_from_directory(TRAIN_DIR, target_size=IMG_SIZE, batch_size=BATCH, class_mode='categorical')
val_ds = val_gen.flow_from_directory(VAL_DIR, target_size=IMG_SIZE, batch_size=BATCH, class_mode='categorical')

model = tensorflow.keras.models.Sequential([
  tensorflow.keras.layers.Input(shape=(IMG_SIZE[0],IMG_SIZE[1],3)),
  tensorflow.keras.layers.Conv2D(32,3,activation='relu'), tensorflow.keras.layers.MaxPooling2D(),
  tensorflow.keras.layers.Conv2D(64,3,activation='relu'), tensorflow.keras.layers.MaxPooling2D(),
  tensorflow.keras.layers.Conv2D(128,3,activation='relu'), tensorflow.keras.layers.MaxPooling2D(),
  tensorflow.keras.layers.Flatten(),
  tensorflow.keras.layers.Dense(128, activation='relu'),
  tensorflow.keras.layers.Dense(NUM_CLASSES, activation='softmax'),
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.fit(train_ds, validation_data=val_ds, epochs=EPOCHS)
model.save('model.h5')
print('Saved model.h5')