"use client"

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("027c05f4-ed5c-4e26-80e4-1ae920bfe2bd");
    }, []);

    return null;
}