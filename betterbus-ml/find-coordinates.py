# importing the module 
import cv2 

# function to display the coordinates of 
# of the points clicked on the image 
def click_event(event, x, y, flags, params): 

    # checking for left mouse clicks 
    if event == cv2.EVENT_LBUTTONDOWN: 

        # displaying the coordinates 
        # on the Shell 
        print(x, ' ', y) 

        # displaying the coordinates 
        # on the image window 
        font = cv2.FONT_HERSHEY_SIMPLEX 
        text = f"{x},{y}"
        text_size = cv2.getTextSize(text, font, 1, 2)[0]
        cv2.rectangle(img, (x, y - text_size[1] - 10), (x + text_size[0] + 10, y), (255, 255, 255), -1)
        cv2.putText(img, text, (x, y - 5), font, 1, (255, 0, 0), 2) 
        cv2.imshow('image', img) 

    # checking for right mouse clicks     
    if event==cv2.EVENT_RBUTTONDOWN: 

        # displaying the coordinates 
        # on the Shell 
        print(x, ' ', y) 

        # displaying the coordinates 
        # on the image window 
        font = cv2.FONT_HERSHEY_SIMPLEX 
        b = img[y, x, 0] 
        g = img[y, x, 1] 
        r = img[y, x, 2]
        text = f"{b},{g},{r}"
        text_size = cv2.getTextSize(text, font, 1, 2)[0]
        cv2.rectangle(img, (x, y - text_size[1] - 10), (x + text_size[0] + 10, y), (255, 255, 255), -1)
        cv2.putText(img, text, (x, y - 5), font, 1, (255, 255, 0), 2) 
        cv2.imshow('image', img) 

# driver function 
if __name__=="__main__": 

    # reading the image 
    img = cv2.imread('valid/images/20240615_195954.jpg', 1) 

    # displaying the image 
    cv2.imshow('image', img) 

    # setting mouse handler for the image 
    # and calling the click_event() function 
    cv2.setMouseCallback('image', click_event) 

    while True:
        # wait for a key to be pressed
        key = cv2.waitKey(1)
        if key == ord('q'):
            break

    # close the window 
    cv2.destroyAllWindows()