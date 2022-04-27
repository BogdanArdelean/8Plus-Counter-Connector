# 8Plus bill counter connector

This project lets you to extract data, like currency and total sum, from an 8Plus bill counter.

![Alt Text](https://media.giphy.com/media/KpYlMAKXTyjjd7rbS3/giphy-downsized-large.gif)

## How does it work

It works by leveraging the printer serial port on the back of the 8Plus. The server reads data from the port and pushes the results in JSON format through websockets.

## Prerequisites

- An 8Plus bill counter
- A computer with a serial port or a serial to USB adapter 
- **!!!You'll probably need a DB9 mother to mother serial cable (crosswire)**
- Python 3

## Setting up and usage

1. Connect the 8Plus to the PC
2. Install the server and connect your client to it. See this guide
3. Load some cash into the 8Plus
4. Hold keypad 8 (PRINT)
5. Voila!




