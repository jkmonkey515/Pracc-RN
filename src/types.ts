export interface ProductType {
    Product: string;
    StartedAt: string;
    EndsAt: string;
    Plan: "starter_monthly" | "pro";
    RecordingCountStartTime: string | null;
    PlanAttributes: any | null;
    IsActive: boolean;
}

export interface ProductTrialsType {
    analytics: ProductType;
    recorder: ProductType;
    reply: ProductType;
}

export interface GroupType {
    ID: number;
    Name: string;
}

export interface TeamType {
    ID: number;
    Name: string;
    Logo: string;
    GameID: number;
    InviteLinkID: string;
    ExternalLinkID: string;
    CalendarLinkID: string;
    IsBeta: boolean;
    NumberOfMatches: number;
    NumberOfOffersSent: number;
    NumberOfOffersReceived: number;
    NumberOfRequests: number;
    NumberOfMissingRatingsLastWeek: number;
    IsRatingOpen: boolean;
    CanKick: boolean;
    CanJoinDropGroup: boolean;
    CanJoinDropBlockTeam: boolean;
    CanDropCreateLinks: boolean;
    CanChangePosition: boolean;
    CanChangeNotes: boolean;
    CanChangeServer: boolean;
    CanManageDiscord: boolean;
    Verified: number;
    GameServerIp: string;
    GameServerPassword: string;
    DiscordServerId: string;
    DiscordSettings: {
        TimeZone: string;
        TimeFormat: string;
        Region: string;
    };
    Groups: Array<GroupType>;
    InstantRequest: null | any;
    Subscriptions: any[];
    ProductTrials: ProductTrialsType;
    AvgRating: number;
    BlockedTeams: TeamType[];
}

export interface Profile {
    ID: string;
    IsAdmin: boolean;
    IsLolAdmin: boolean;
    IsProUser: boolean;
    Steam64ID: string;
    Avatar: string;
    IsCustomAvatar: boolean;
    PersonName: string;
    ProfileURL64: string;
    Settings: {
        ID: string;
        CreatedAt: string;
        UpdatedAt: string;
        DeletedAt: null;
        PinDrawer: boolean;
        LocalTimezone: string;
        TimeFormat: string;
        Theme: "dark" | "light";
        NotificationSettings: {

        };
        GoogleCalendarSettings: {
        Synchronize: boolean;
        };
        SteamAccountID: string;
        TimeFormatString: string;
    };
    Teams: TeamType[];
    HasSetEmail: boolean;
    IsEmailConfirmed: boolean;
    Email: string;
    NewNotifications: number;
    MobileDevices: Array<{
        ID: number;
        Name: string;
        HasPushToken: boolean;
    }>;
    BausteinSignature: string;
    SignedUpAt: string;
    RecorderToken: string | null;
    Accounts: Array<{
        Provider: "discord" | "steam" | "email";
        ThirdPartyId: string;
        DisplayName: string;
        HasCredentials: boolean;
        HasValidCredentials: boolean;
    }>;
    Boosts: {};
    Deathmatch: {
        LitePlaytimePercentage: number;
        LiteUntil: null;
    };
    Team: TeamType;
    NewMessages: number;
}

export interface MapType {
    Id: number;
    Name: string;
    ThumbnailUrl: string;
    Inactive: boolean;
}

export interface RegionType {
    Id: string;
    Label: string;
}

export interface GameType {
    Id: number;
    Name: string;
    Maps: MapType[] | null;
    Regions: RegionType[] | null;
    GameCounts: null | number[];
}

export interface NotificationType {
    NotificationID: number;
    Who: string;
    What: string;
    Description: string;
    AvatarUrl: string;
    Time: string;
    MatchTime: string | null;
    TeamID: number;
    OfferID: number;
    MatchID: number | null;
    GroupID: number | null;
    CreatedAt: string;
}

export interface MatchMessage {
    PersonaName: string;
    TeamName: string;
    TeamID: number;
    Position: string;
    Time: string;
    Message: string;
    AvatarURL: string;
}