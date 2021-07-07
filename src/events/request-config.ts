import { config } from '../index';

export default function(event) {
    event.sender.send('update-config', config.all());   
}