import { envs } from 'src/config/envs';
import { CreateLostPetDto } from '../dtos/lost-pet.dto';

const row = (label: string, value: string) => `
              <tr>
                <td style="padding:14px 0;border-bottom:1px solid #e3efe6;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:18px;color:#6b8676;text-transform:uppercase;letter-spacing:.6px;">${label}</td>
                <td align="right" style="padding:14px 0;border-bottom:1px solid #e3efe6;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:22px;color:#143d24;font-weight:bold;">${value}</td>
              </tr>`;

export const generateLostPetTemplate = (createLostPetDto: CreateLostPetDto) => {
  const { type, name, phone, race, age, color, lat, lon } = createLostPetDto;
  const ageLabel = `${age} ${age === 1 ? 'año' : 'años'}`;
  const mapboxToken = envs.MAPBOX_TOKEN;
  const imageUrl = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-l+1b7a45(${lon},${lat})/${lon},${lat},15/496x240@2x?access_token=${mapboxToken}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Mascota perdida: ${name}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f2f8f4;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2f8f4;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(20,61,36,.08);">

            <!-- Header -->
            <tr>
              <td style="background-color:#1b7a45;padding:32px 32px 28px 32px;">
                <p style="margin:0 0 10px 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:16px;letter-spacing:1.4px;text-transform:uppercase;color:#a7e6c2;">Pet Radar &middot; Alerta</p>
                <h1 style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:28px;line-height:34px;color:#ffffff;font-weight:bold;">Se busca a ${name}</h1>
                <p style="margin:10px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:22px;color:#d3f3e0;">Un ${type.toLowerCase()} se ha perdido cerca de tu zona. Si lo ves, comunícate de inmediato.</p>
              </td>
            </tr>

            <!-- Detalles -->
            <tr>
              <td style="padding:28px 32px 8px 32px;">
                <h2 style="margin:0 0 8px 0;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:20px;letter-spacing:1px;text-transform:uppercase;color:#1b7a45;">Datos de la mascota</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${row('Nombre', name)}
${row('Tipo', type)}
${row('Raza', race)}
${row('Color', color)}
${row('Edad', ageLabel)}
                </table>
              </td>
            </tr>

            <!-- Ubicación -->
            <tr>
              <td style="padding:28px 32px 8px 32px;">
                <h2 style="margin:0 0 12px 0;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:20px;letter-spacing:1px;text-transform:uppercase;color:#1b7a45;">Última ubicación</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eaf6ee;border-radius:14px;">
                  <tr>
                    <td style="padding:8px;">
                      <a href="${mapsUrl}" target="_blank" style="display:block;text-decoration:none;">
                        <img src="${imageUrl}" width="496" alt="Mapa de la última ubicación de ${name}" style="display:block;width:100%;max-width:496px;height:auto;border:0;outline:none;border-radius:10px;" />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding:4px 16px 20px 16px;">
                      <p style="margin:0 0 14px 0;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:19px;color:#4f7a5f;">Zona aproximada donde se vio a ${name} por última vez.</p>
                      <a href="${mapsUrl}" target="_blank" style="display:inline-block;background-color:#ffffff;border:2px solid #1b7a45;color:#1b7a45;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:18px;font-weight:bold;text-decoration:none;padding:11px 26px;border-radius:999px;">Ver en Google Maps &rarr;</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Contacto -->
            <tr>
              <td style="padding:24px 32px 8px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eaf6ee;border-radius:12px;">
                  <tr>
                    <td align="center" style="padding:24px;">
                      <p style="margin:0 0 6px 0;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:18px;letter-spacing:.6px;text-transform:uppercase;color:#4f7a5f;">Contacto del dueño</p>
                      <p style="margin:0 0 18px 0;font-family:Helvetica,Arial,sans-serif;font-size:24px;line-height:30px;color:#143d24;font-weight:bold;">${phone}</p>
                      <a href="tel:${phone}" style="display:inline-block;background-color:#1b7a45;color:#ffffff;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:20px;font-weight:bold;text-decoration:none;padding:14px 32px;border-radius:999px;">Llamar ahora</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:24px 32px 32px 32px;">
                <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:18px;color:#8aa694;text-align:center;">Recibiste este correo porque formas parte de la red de alertas de Pet Radar.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
