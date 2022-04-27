import serial

BillCounterSerialException = serial.SerialException

class BillCounter:
    def __init__(self, serial_port) -> None:
        self.serial_port = serial_port
        self.ser = None
    
    def open(self) -> bool:
        self.ser = serial.Serial(self.serial_port)
        return self.ser.isOpen()
    
    def close(self) -> None:
        if self.ser.isOpen():
            self.ser.close()

    def is_open(self) -> bool:
        return self.ser.isOpen()
    
    def read(self) -> dict:
        parser = BillCounter.ResultParser()

        if not self.ser.isOpen():
            return parser.to_dict()

        while not parser.isDone():
            line = self.ser.readline()
            parser.parse_line(line)
        
        return parser.to_dict()
    
    class ResultParser:
        def __init__(self) -> None:
            self.is_done = False
            self.result = dict()
        
        def to_dict(self) -> dict:
            return self.result
        
        def isDone(self) -> bool:
            return self.is_done
        
        def parse_line(self, line) -> None:
            tokens = line.decode('UTF-8').split()
            if not tokens:
                return

            if tokens[0].startswith('CUR:'):
                self.result['currency'] = tokens[0].split(':')[1]
            elif tokens[0] == 'TOTAL':
                self.result['total'] = tokens[2]
                self.is_done = True

def main():
    counter = BillCounter('/dev/tty.usbserial-14240')
    counter.open()
    print('Counter state: ', counter.is_open())
    while True:
        try:
            print(counter.read())
        except KeyboardInterrupt:
            break
    counter.close()
    print('Exiting program...')

if __name__ == "__main__":
    main()



        