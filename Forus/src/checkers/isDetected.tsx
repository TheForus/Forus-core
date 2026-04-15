import { Notyf } from "notyf";

export const isDetected = async () => {
    const notyf = new Notyf({ duration: 5000 });

    const { ethereum }: any = window;

    if (ethereum === undefined) {
        notyf.error("Plz install metamask");
        return;
    }
};
