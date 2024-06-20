export const CHANGE_INPUT = "CHANGE_INPUT";
export const ADD_IMAGES = "ADD_IMAGES";
export const ADD_FEATURE = "ADD_FEATURE";
export const REMOVE_FEATURE = "REMOVE_FEATURE";
export const PHOTOGRAPHY = "Photography";
export const OPEN_BID = "Open for bid";
export const WIP = "Work in Progress";
export const READY_FOR_REVIEW = "Ready for review";
export const APPROVED = "Approved";
export const PAID = "Paid";
export const COMPLETED = "Completed";
export const LOADING = "loading";
export const ERROR_GENERIC = "Something went wrong. Please try again later";
export const STEPPER = {
    [OPEN_BID]: 0,
    [WIP]: 1,
    [READY_FOR_REVIEW]: 2,
    [APPROVED]: 3,
    [PAID]: 4,
    [COMPLETED]: 5
}

export const PAYMENT_SUCCESS = "Payment successful. You are being redirected to the orders page. Please do not close or refresh this page";

export const POSTER_PLACEHOLDER = "A short description of yourself";
export const BIDDER_PLACEHOLDER = "along with list of all your skills and proficiencies";
//Categories
export const GRAPHICS_AND_DESIGN = "Graphics & Design";
export const VIDEO_AND_ANIMATION = "Video & Animation";
export const WRITING_AND_TRANSLATION = "Writing & Translation";
export const DIGITAL_MARKETING = "Digital Marketing";
export const MUSIC_AND_AUDIO = "Music & Audio";
export const PROGRAMMING_AND_TECH = "Programming & Tech";
export const BUSINESS = "Business";
export const LIFESTYLE = "Lifestyle";
export const AI_SERVICES = "AI Services";

export const  SKILL_OPTIONS = [
    { label: GRAPHICS_AND_DESIGN, value: GRAPHICS_AND_DESIGN},
    { label: VIDEO_AND_ANIMATION, value: VIDEO_AND_ANIMATION},
    { label: WRITING_AND_TRANSLATION, value: WRITING_AND_TRANSLATION},
    { label: DIGITAL_MARKETING, value: DIGITAL_MARKETING},
    { label: MUSIC_AND_AUDIO, value: MUSIC_AND_AUDIO},
    { label: PROGRAMMING_AND_TECH, value: PROGRAMMING_AND_TECH},
    { label: BUSINESS, value: BUSINESS},
    {label: LIFESTYLE, value: LIFESTYLE},
    {label: AI_SERVICES, value: AI_SERVICES}
];
