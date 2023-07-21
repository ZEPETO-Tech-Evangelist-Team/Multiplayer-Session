import {Sandbox, SandboxOptions, SandboxPlayer} from "ZEPETO.Multiplay";
import { Player } from "ZEPETO.Multiplay.Schema";
import { IModule } from "./ServerModule/IModule";
import SyncComponentModule from "./ServerModule/Modules/SyncComponentModule";

export default class extends Sandbox {

    private readonly _modules: IModule[] = [];
    private _isCreated: boolean = false;

    private playerOneChoice : number = -1; // 0 = Rock | 1 = Paper | 2 = Scissors
    private playerTwoChoice : number = -1; // 0 = Rock | 1 = Paper | 2 = Scissors
    
    async onCreate(options: SandboxOptions)
    {
        this._modules.push(new SyncComponentModule(this));
        for (const module of this._modules) {
            await module.OnCreate();
        }
        this._isCreated = true;

        this.onMessage("R1", (client, message) =>
        {
            this.ButtonPressed(0);
        });
        this.onMessage("P1", (client, message) =>
        {
            this.ButtonPressed(1);
        });
        this.onMessage("S1", (client, message) =>
        {
            this.ButtonPressed(2);
        });

        this.onMessage("R2", (client, message) =>
        {
            this.ButtonPressed(3);
        });
        this.onMessage("P2", (client, message) =>
        {
            this.ButtonPressed(4);
        });
        this.onMessage("S2", (client, message) =>
        {
            this.ButtonPressed(5);
        });


    }

    async onJoin(client: SandboxPlayer) {
        for (const module of this._modules) {
            await module.OnJoin(client);
        }

        const player = new Player();
        player.sessionId = client.sessionId;
        if (client.hashCode) {
            player.zepetoHash = client.hashCode;
        }
        if (client.userId) {
            player.zepetoUserId = client.userId;
        }
        this.state.players.set(client.sessionId, player);
        
        console.log(`join player, ${client.sessionId}`);
    }
    

    async onLeave(client: SandboxPlayer, consented?: boolean) {
        for (const module of this._modules) {
            await module.OnLeave(client);
        }
        this.state.players.delete(client.sessionId);

        console.log(`leave player, ${client.sessionId}`);
    }

    async onTick(deltaTime: number) {
        if (!this._isCreated) {
            return;
        }
        for (const module of this._modules) {
            module.OnTick(deltaTime);
        }
    }

    ButtonPressed(num : number)
    {
        //Rock Player #1
        if(num == 0)
        {
            this.playerOneChoice = 0;
        }
        //Paper Player #1
        else if(num == 1)
        {
            this.playerOneChoice = 1;
        }

        //Scissors Player #1
        else if(num == 2)
        {
            this.playerOneChoice = 2;
        }

        //Rock Player #2
        else if(num == 3)
        {
            this.playerTwoChoice = 0;
        }

        //Paper Player #2
        else if(num == 4)
        {
            this.playerTwoChoice = 1;
        }

        //Scissors Player #2
        else if(num == 5)
        {
            this.playerTwoChoice = 2;
        }

        this.CheckForWin();
    }

    CheckForWin()
    {
        if(this.playerOneChoice != -1 && this.playerTwoChoice != -1)
        {
            //Tie
            if(this.playerOneChoice == this.playerTwoChoice)
            {
                this.broadcast("Update Game Board", "It was a tie!");
            }

            //Player #1 Wins
            else if
            (
                this.playerOneChoice == 0 && this.playerTwoChoice == 2 ||  
                this.playerOneChoice == 1 && this.playerTwoChoice == 0 ||
                this.playerOneChoice == 2 && this.playerTwoChoice == 1
            )
            {
                this.broadcast("Update Game Board", "Player #1 Wins!");
            }
            
            //Player #2 wins
            else
            {
                this.broadcast("Update Game Board", "Player #2 Wins!");
            }

            this.playerOneChoice = -1;
            this.playerTwoChoice = -1;
        }
    }
}

