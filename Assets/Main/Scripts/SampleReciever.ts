import { Room } from 'ZEPETO.Multiplay';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoWorldMultiplay } from 'ZEPETO.World'

export default class SampleReciever extends ZepetoScriptBehaviour
{
    public world : ZepetoWorldMultiplay;

    private room : Room;

    Start()
    {    
        this.world.RoomJoined += (room: Room) =>
        {
            room.AddMessageHandler("Sample Multiplayer Message", (message : string) => 
            {
                console.log("Hey! I've been got.");
            });
        }
    }

}