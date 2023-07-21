import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { Camera, Canvas, Collider, GameObject, Transform, Object } from 'UnityEngine';
import { Button } from 'UnityEngine.UI';
import { UnityEvent } from 'UnityEngine.Events';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { Room, RoomData } from 'ZEPETO.Multiplay';
import { ZepetoWorldMultiplay } from 'ZEPETO.World';
 
export default class InteractionIcon extends ZepetoScriptBehaviour {
     
    // Icon
    @Header("[Icon]")
    @SerializeField() private prefIconCanvas: GameObject;
    @SerializeField() private iconPosition: Transform;
     
    // Unity Event    
    @Header("[Unity Event]")
    public eventMessage: string;
    public mpObject: GameObject;
    public room: Room;
    private multiplay: ZepetoWorldMultiplay;
    public OnTriggerEnterEvent: UnityEvent;
    public OnTriggerExitEvent: UnityEvent;
 
    private _button: Button;
    private _canvas: Canvas;   
    private _cachedWorldCamera: Camera;
    private _isIconActive: boolean = false;
    private _isDoneFirstTrig: boolean = false;

    public isStart: boolean;
     
    Start(){
        this.multiplay = this.mpObject.GetComponent<ZepetoWorldMultiplay>();
        this.multiplay.RoomJoined += (room: Room) =>
        {
            this.room = room;
        }
        if(!this.isStart)
        {
            this.gameObject.transform.GetChild(0).gameObject.SetActive(false);
        }
    }
     
    private Update() {
        if (this._isDoneFirstTrig && this._canvas?.gameObject.activeSelf) {
            this.UpdateIconRotation();
        }
    }
     
    private OnTriggerEnter(coll: Collider) {
        if (coll != ZepetoPlayers.instance.LocalPlayer?.zepetoPlayer?.character.GetComponent<Collider>()) {
            return;
        }
         
        this.ShowIcon();
        this.OnTriggerEnterEvent?.Invoke();
    }
 
    private OnTriggerExit(coll: Collider) {
        if (coll != ZepetoPlayers.instance.LocalPlayer?.zepetoPlayer?.character.GetComponent<Collider>()) {
            return;
        }
         
        this.HideIcon();
        this.OnTriggerExitEvent?.Invoke();
    }
     
    public ShowIcon(){
        if (!this._isDoneFirstTrig) {
            this.CreateIcon();
            this._isDoneFirstTrig = true;
        }
        else {
            this._canvas.gameObject.SetActive(true);
        }
        this._isIconActive = true;
    }
     
    public HideIcon() {
        this._canvas?.gameObject.SetActive(false);
        this._isIconActive = false;
    }
 
    private CreateIcon() {
        if (this._canvas === undefined) {
            const canvas = GameObject.Instantiate(this.prefIconCanvas, this.iconPosition) as GameObject;
            this._canvas = canvas.GetComponent<Canvas>();
            this._button = canvas.GetComponentInChildren<Button>();
            this._canvas.transform.position = this.iconPosition.position;
        }
        this._cachedWorldCamera = Object.FindObjectOfType<Camera>();
        this._canvas.worldCamera = this._cachedWorldCamera;
 
        this._button.onClick.AddListener(() => {
            this.OnClickIcon();
        });
    }
     
    private UpdateIconRotation()
    {
        this._canvas.transform.LookAt(this._cachedWorldCamera.transform);
    }
 
    private OnClickIcon()
    {
        this.room.Send(this.eventMessage);
        console.log("Message Sent!");
    }
}