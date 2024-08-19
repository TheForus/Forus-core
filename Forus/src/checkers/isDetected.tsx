import { Notyf } from "notyf";

export const isDetected = async () => {
    const notyf = new Notyf();

    const { ethereum }: any = window;

    if (ethereum === undefined) {
        notyf.error("Plz install metamask");
        return;
    }
};