import React from "react";
import { Text, View } from "react-native";
import DestinyStats from "./DestinyStats"

/**
 * Class DestinyPlayer
 */
class DestinyPlayer extends React.Component {

    /**
     * State into the api loader
     */
    state = {
        url: '',
        playerName: '',
        isLoaded: false,
        account_id: '',
        membershipType: '',
        error: false,
        platformId: '',
        invalidAccount: false,
        stat: false,
        match: false
    };

    /**
     * Component CTOR
     * @param {} props Props containing url, playerName
     */
    constructor(props) {
        super(props);
        this.state = {
            playerName: props.playerName,
            isLoaded: false,
            platformId: props.platformId,
            account_id: '',
            membershipType: '',
            error: false,
            invalidAccount: false,
            stat: props.stat,
            match: props.match,
            url: "https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/" ,
        };
    }

    componentDidMount() {
        if (this.state.playerName === '') return;
        fetch(this.state.url + this.state.platformId + '/' + this.state.playerName, {
            method: 'GET',
            headers: {
                'x-api-key': '551b69f4972440f9bfb0a3b2a8a9ed62'
            }
        }).then(res => {
            res.json().then(json => {
                if (json.ErrorCode !== 1) {
                    this.setState({
                        invalidAccount: true,
                        isLoaded: true
                    })
                } else if (json["Response"] !== null) {
                    this.setState({
                        account_id: json["Response"][0].membershipId,
                        playerName: json["Response"][0].displayName,
                        membershipType: json["Response"][0].membershipType,
                        isLoaded: true
                    })
                }
            }).catch(() => {
                this.setState({
                    error: true
                });
            });
        }).catch(() => {
            this.setState({
                error: true
            });
        });
    }

    render() {
        if (this.state.error) {
            return (
                <Text style={{color:'black'}}>La récupération des données a échouée.</Text>
            );
        }
        if (!this.state.isLoaded) {
            return (
                <Text style={{color:'black'}}>Chargement des informations basique...</Text>
            );
        } else {
            if (this.state.invalidAccount) {
                return (
                    <Text style={{color:'black'}}>Ce compte n'existe pas, vérifiez le pseudo que vous avez entré.</Text>
                );
            } else {
                if (this.state.stat) {
                    return (
                        <View>
                            <Text style={{color: 'black'}}>Bungie.net username: {this.state.playerName}</Text>
                            <Text style={{color: 'black'}}>MembershipId: {this.state.account_id}</Text>
                            <DestinyStats accountId={this.state.account_id} playerName={this.state.playerName} membershipType={this.state.membershipType}></DestinyStats>
                        </View>
                    );
                } else {
                    return (
                        <View>
                            <Text style={{color: 'black'}}>Username: {this.state.playerName}</Text>
                            <Text style={{color: 'black'}}>PlayerID: {this.state.account_id}</Text>
                            {/* <DestinyStats accountId={this.state.account_id} playerName={this.state.playerName} membershipType={this.state.platformId}></DestinyStats> */}
                        </View>
                    );
                }
            }
        }
    }
}

export default DestinyPlayer;