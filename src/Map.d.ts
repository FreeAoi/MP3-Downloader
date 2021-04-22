import { Readable } from "stream";

declare global {
    interface Map<K, V> {
        _listeners: (() => any)[];
        onChange(callback: () => any): void;
        change(): void;
        array(): V[];
        add(id: K, data: V): void;
        remove(id: K): void;
    }
}

declare module "youtube-sr" {
    interface Video {
        progress: number;
        stream: Readable;
    }
}

export { };