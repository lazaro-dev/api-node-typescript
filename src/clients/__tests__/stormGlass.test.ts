import { StormGlass } from '@src/clients/stormGlass';
import axios  from 'axios';
import stormGlassWeather3horsFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';


jest.mock('axios');

describe('StormGlass client', () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    it('should return the normalized forecast the StormGlass service', async () => {
        const lat = -33.792726;
        const lng = 151.289824;

        axios.get = jest.fn().mockResolvedValue(stormGlassWeather3horsFixture);

        const stormGlass = new StormGlass(mockedAxios);
        const response = await stormGlass.fechPoints(lat, lng);
        expect(response).toEqual(stormGlassNormalized3HoursFixture);
    })
})