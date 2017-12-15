
# Here, views serve as the functions that perform the necessary procedures in get
# and post requests.

from django.conf import settings
from django.shortcuts import render, redirect
from django.views import generic
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.http import HttpResponse

from .models import Dot, Game, Player, Board, Goon

import time
from datetime import date

import random

# Take a username, password, and email and use it to create a new account.
@api_view(['GET','POST'])
def make_redder(request):
    
    # d = Dot.objects.get(id = 1)
    
    # d.redColor += 10
    # d.save()

    # return Response({d.redColor})
    pass

@api_view(['GET','POST'])
def get_red(request):
    
    # d = Dot.objects.get(id = 1)

    # return Response({d.redColor})
    pass

@api_view(['GET','POST'])
def make_less_red(request):
    # d = Dot.objects.get(id = 1)
    
    # d.redColor -= 10
    # d.save()

    # return Response({d.redColor})
    pass

@api_view(['GET','POST'])
def make_new_game(request):
    # make a new game
    game = Game.objects.create()
    gameID = game.id

    # get and set corresponding board
    board = game.board_set.create()
    board.numRows = 13
    board.numCols = 13

    game.over = False

    game.boardTemplateNum = 0

    board.save()

    set_board(board, game.boardTemplateNum)

    # get and set corresponding player
    player = game.player_set.create()
    player.xPos = 0
    player.yPos = 0
    player.direction = 1

    goon1 = game.goon_set.create()
    goon2 = game.goon_set.create()

    boardTuple = get_board_tuple(board)

    allGoons = game.goon_set.all()

    for currentGoon in allGoons:
        set_goon_location(currentGoon, player, boardTuple)


    allSpots = board.spot_set.all()


    game.save()
    board.save()
    player.save()


    return Response({'board' : boardTuple, 'playerX': player.xPos,
        'playerY' : player.yPos, 'playerDir' : player.direction, 
        'goonX1': goon1.xPos, 'goonY1': goon1.yPos, 
        'goonX2': goon2.xPos, 'goonY2': goon2.yPos})

def set_goon_location(goon, player, boardTuple):

    bufferSpots = 4

    playerXPos = player.xPos
    playerYPos = player.yPos

    goon.xPos = random.randint(bufferSpots, len(boardTuple[0])-bufferSpots)
    goon.yPos = random.randint(bufferSpots, len(boardTuple)-bufferSpots)

    while(is_goon_placement_legal(boardTuple,playerXPos, playerYPos, goon.xPos, goon.yPos) == False):
        goon.xPos = random.randint(bufferSpots, len(boardTuple[0])-bufferSpots)
        goon.yPos = random.randint(bufferSpots, len(boardTuple)-bufferSpots) 

    goon.save()  

def set_board(board, templateNum):

    boardTemplates = [ 

    #first
    [[ False,  False,   True,   True,   True,   True,   True,   True,   True,   True,   True,   True,   True],
     [ False,  False,  False,  False,  False,  False,  False,  False,  False,  False,  False,  False,   True],
     [  True,  False,   True,   True,  False,   True,   True,   True,  False,   True,   True,  False,   True],
     [  True,  False,   True,  False,  False,  False,  False,  False,  False,  False,   True,  False,   True],
     [  True,  False,  False,  False,   True,   True,   True,   True,   True,  False,  False,  False,   True],
     [  True,  False,   True,  False,  False,  False,  False,  False,  False,  False,   True,  False,   True],
     [  True,  False,   True,  False,   True,  False,   True,  False,   True,  False,   True,  False,   True],
     [  True,  False,   True,  False,  False,  False,  False,  False,  False,  False,   True,  False,   True],
     [  True,  False,  False,  False,   True,   True,   True,   True,   True,  False,  False,  False,   True],
     [  True,  False,   True,  False,  False,  False,  False,  False,  False,  False,   True,  False,   True],
     [  True,  False,   True,   True,  False,   True,   True,   True,  False,   True,   True,  False,   True],
     [  True,  False,  False,  False,  False,  False,  False,  False,  False,  False,  False,  False,  False],
     [  True,   True,   True,   True,   True,   True,   True,   True,   True,   True,   True,  False,  False]],


    #second
    [[ False, False,  True,  True,  True,  True,  True,  True,  True,  True,  True,  True,  True],
     [ False, False, False,  True, False, False,  True, False, False,  True, False, False,  True],
     [  True,  True, False, False, False,  True,  True,  True, False, False, False,  True,  True],
     [  True, False, False,  True, False, False,  True, False, False,  True, False, False,  True],
     [  True, False,  True,  True,  True, False, False, False,  True,  True,  True, False,  True],
     [  True, False, False,  True, False, False,  True, False, False,  True, False, False,  True],
     [  True,  True, False, False, False,  True,  True,  True, False, False, False,  True,  True],
     [  True, False, False,  True, False, False,  True, False, False,  True, False, False,  True],
     [  True, False,  True,  True,  True, False, False, False,  True,  True,  True, False,  True],
     [  True, False, False,  True, False, False,  True, False, False,  True, False, False,  True],
     [  True,  True, False, False, False,  True,  True,  True, False, False, False,  True,  True],
     [  True, False, False,  True, False, False,  True, False, False,  True, False, False, False],
     [  True,  True,  True,  True,  True,  True,  True,  True,  True,  True,  True, False, False]],

    
    #third
    [[ False, False,  True,  True,  True,  True,  True,  True,  True,  True,  True,  True,  True],
     [ False, False,  True, False, False, False,  True, False, False, False,  True, False,  True],
     [  True, False,  True, False,  True, False,  True, False,  True, False,  True, False,  True],
     [  True, False, False, False,  True, False, False, False,  True, False, False, False,  True],
     [  True,  True,  True, False, False, False,  True, False, False, False,  True,  True,  True],
     [  True, False, False, False, False,  True,  True,  True, False, False, False, False,  True],
     [  True, False,  True,  True, False, False, False, False, False,  True,  True, False,  True],
     [  True, False, False, False, False,  True,  True,  True, False, False, False, False,  True],
     [  True,  True,  True,  True, False,  True, False, False, False,  True,  True,  True,  True],
     [  True, False, False, False, False, False, False,  True, False, False, False, False,  True],
     [  True, False,  True,  True, False,  True, False,  True, False,  True, False,  True,  True],
     [  True, False, False, False, False,  True, False, False, False,  False, False, False, False],
     [  True,  True,  True,  True,  True,  True,  True,  True,  True,  True,  True, False, False]]
                

    ]

    boardTemplate = boardTemplates[templateNum%3]

    if(len(board.spot_set.all()) > 0):
        allSpots = board.spot_set.all()
        for currentSpot in allSpots:
            currentSpot.delete()

    for row in range(board.numRows):
        for col in range(board.numCols):
            board.spot_set.create(xPos = col, yPos = row, 
                filled = boardTemplate[row][col])    

    board.save()

    board.beingSet = False



@api_view(['GET','POST'])
def get_game(request): 

    gameID = 156

    game = Game.objects.get(id = gameID)
    board = Board.objects.get(game_id = gameID)
    player = Player.objects.get(game_id = gameID)
    game.boardTemplateNum += 1
    set_board(board, game.boardTemplateNum)
    board.save()
    boardTuple = get_board_tuple(board)
    goons = game.goon_set.all()
    goonArray = []

    player.xPos = 0
    player.yPos = 0

    player.save()

    for goon in goons:
        set_goon_location(goon, player, boardTuple)

    for goon in goons:
        goonArray.append(goon)

    game.over = False

    game.save()

    return Response({'board' : boardTuple, 'playerX': player.xPos,
        'playerY' : player.yPos, 'playerDir' : player.direction, 
        'goonX1': goonArray[0].xPos, 'goonY1': goonArray[0].yPos, 
        'goonX2': goonArray[1].xPos, 'goonY2': goonArray[1].yPos,
        'score': game.score})

@api_view(['GET','POST'])
def get_game_no_changes(request): 

    gameID = 156

    game = Game.objects.get(id = gameID)
    board = Board.objects.get(game_id = gameID)
    player = Player.objects.get(game_id = gameID)
    boardTuple = get_board_tuple(board)
    goons = game.goon_set.all()
    goonArray = []

    for goon in goons:
        goonArray.append(goon)

    return Response({'board' : boardTuple, 'playerX': player.xPos,
        'playerY' : player.yPos, 'playerDir' : player.direction, 
        'goonX1': goonArray[0].xPos, 'goonY1': goonArray[0].yPos, 
        'goonX2': goonArray[1].xPos, 'goonY2': goonArray[1].yPos,
        'score': game.score})

def get_board_tuple(board):
    # convert all the spots to a tuple so that it can be sent back to the frontend
    allSpots = board.spot_set.all()
    output = []

    count = 0
    tempRow = []
    for currentSpot in allSpots:
        count += 1
        tempRow.append([currentSpot.yPos, currentSpot.xPos, currentSpot.filled])
        if(count % board.numRows == 0):
            output.append(tempRow)
            tempRow = []
    output = tuple(output)
    return output

@api_view(['GET','POST'])
def move_goons(request):
    
    directions = [(0, -1), (1, 0), (0, 1), (-1, 0)]
    
    gameID = 156

    board = Board.objects.get(game_id = gameID)
    boardTuple = get_board_tuple(board)

    player = Player.objects.get(game_id = gameID)
    game = Game.objects.get(id = gameID)
    goons = game.goon_set.all()

    for goon in goons:
        # goon.xPos = 0
        # goon.yPos = 0
        dirIndex = random.randint(0, len(directions)-1)
        if(is_legal(directions[dirIndex], boardTuple, goon.xPos, goon.yPos)):
            goon.xPos += directions[dirIndex][0]
            goon.yPos += directions[dirIndex][1]
        goon.save()

    goonArray = []
    for goon in goons:
        goonArray.append(goon)

    if(isGameOver(player, goons)):
        game.score = 0
        game.over = True
        game.save()

    return Response({'goonX1': goonArray[0].xPos, 'goonY1': goonArray[0].yPos, 
        'goonX2': goonArray[1].xPos, 'goonY2': goonArray[1].yPos,
        'over':game.over})



@api_view(['GET','POST'])
def move_player(request):
    direction = request.data['dir']
    dirTuple = (0, -1)
    if(direction == 'up'):
        dirTuple = (0, -1)
    elif(direction == 'down'):
        dirTuple = (0, 1)
    elif(direction == 'left'):
        dirTuple = (-1, 0)
    elif(direction == 'right'):
        dirTuple = (1, 0)

    gameID = 156

    board = Board.objects.get(game_id = gameID)
    player = Player.objects.get(game_id = gameID)
    game = Game.objects.get(id = gameID)

    boardTuple = get_board_tuple(board)

    if(is_legal(dirTuple, boardTuple, player.xPos, player.yPos)):
        player.xPos += dirTuple[0]
        player.yPos += dirTuple[1]
        player.save()

    

    if(player.xPos == board.numCols -1 and player.yPos == board.numRows -1):
        game.score += 1
        game.boardTemplateNum += 1
        if(board.beingSet == False):
            board.beingSet = True
            set_board(board, game.boardTemplateNum)
        board.save()
        player.xPos = 0
        player.yPos = 0
        boardTuple = get_board_tuple(board)
        goons = game.goon_set.all()
        for goon in goons:
            allGoons = game.goon_set.all()
            set_goon_location(goon, player, boardTuple)

    game.save()
    player.save()
    boardTuple = get_board_tuple(board)

    goons = game.goon_set.all()
    goonArray = []
    for goon in goons:
        goonArray.append(goon)

    if(isGameOver(player, goons)):
        game.score = 0
        game.over = True
        game.save()

    print(game.boardTemplateNum)

    return Response({'board' : boardTuple, 'playerX': player.xPos,
        'playerY' : player.yPos, 'playerDir' : player.direction, 
        'goonX1': goonArray[0].xPos, 'goonY1': goonArray[0].yPos, 
        'goonX2': goonArray[1].xPos, 'goonY2': goonArray[1].yPos,
        'over':game.over, 'score': game.score})

def isGameOver(player, goons):
    for goon in goons:
        # print(player.xPos, player.yPos)
        # print(goon.xPos, goon.yPos)
        if(player.xPos == goon.xPos and player.yPos == goon.yPos):
            return True
    
    return False    



def is_legal(dirTuple, boardTuple, itemXPos, itemYPos):
    newXPos = itemXPos + dirTuple[0]
    newYPos = itemYPos + dirTuple[1]

    if(newYPos >= len(boardTuple) or newYPos < 0):
        return False      
    elif(newXPos >= len(boardTuple[0]) or newXPos < 0):
        return False      
    elif(boardTuple[newYPos][newXPos][2]):
        return False      
    else:
        return True 

def is_goon_placement_legal(boardTuple, playerXPos, playerYPos, goonXPos, goonYPos):
    if(boardTuple[goonYPos][goonXPos][2]):
        return False      
    elif(playerXPos == goonXPos and playerYPos == goonYPos):
        return False      
    else:
        return True     


