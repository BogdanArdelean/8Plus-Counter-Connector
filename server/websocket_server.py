import asyncio
import websockets
import sys
import functools
import billcounter
import logging
import json

logging.basicConfig(filename='8plus.log', encoding='utf-8', level=logging.INFO, filemode="w")
log = logging.getLogger(__name__)
ERROR_MESSAGE = {'error': True}

queues = {}

async def notify_all_clients(result):
    for queue in queues.values():
        await queue.put(result)

async def create_counter(serial_port):
    for i in range(5):
        counter = billcounter.BillCounter(serial_port)
        
        try:
            counter.open()
        except billcounter.BillCounterSerialException:
            counter = None
        
        if counter != None:
            return counter
        
        await asyncio.sleep(5)
    
    return None

async def handle_counter(serial_port):
    loop = asyncio.get_running_loop()
    counter = await create_counter(serial_port)
    if counter == None:
        return
    
    while True:
        try:
            result = await loop.run_in_executor(None, counter.read)
            await notify_all_clients(result)

        except billcounter.BillCounterSerialException:
            log.error("Error while reading serial port. Reconnecting to bill counter")
            counter = await create_counter(serial_port)
            if not counter:
                break
    
    log.error("Could not connect to bill counbter. Aborting...")
    
    notify_all_clients(ERROR_MESSAGE)

async def handle_web_clients(websocket):

    queue = asyncio.Queue()
    queues[str(websocket.id)] = queue

    while True:
        try:
            result = await queue.get()
            await websocket.send(json.dumps(result))

            if 'error' in result:
                break
        except:
            log.error("Exception occured in client")
            break

    queues.pop(str(websocket.id), None)
    log.error("Aborting...")

async def main(serial_port, websocket_port):
    asyncio.create_task(handle_counter(serial_port))

    async with websockets.serve(functools.partial(handle_web_clients), "", websocket_port):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main(sys.argv[1], int(sys.argv[2])))