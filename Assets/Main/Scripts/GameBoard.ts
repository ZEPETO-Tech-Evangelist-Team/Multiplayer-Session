import { Room } from 'ZEPETO.Multiplay';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoWorldMultiplay } from 'ZEPETO.World';
import { Text } from 'UnityEngine.UI';

export default class GameBoard extends ZepetoScriptBehaviour
{
    public text : Text;

    public world : ZepetoWorldMultiplay;
    private room : Room;

    Start()
    {    
        this.world.RoomJoined += (room: Room) =>
        {
            room.AddMessageHandler<string>("Update Game Board", (message : string) => 
            {
                this.text.text = message;
            });
        }
    }

}