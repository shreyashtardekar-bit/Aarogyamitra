import urllib.request, json

def req(url, data=None, headers={}):
    req = urllib.request.Request(url, data=data, headers=headers, method='POST' if data else 'GET')
    try:
        with urllib.request.urlopen(req) as response:
            return response.read().decode()
    except urllib.error.HTTPError as e:
        return e.read().decode()
    except Exception as e:
        return str(e)

# login
login_data = b'username=admin&password=admin123'
login_headers = {'Content-Type': 'application/x-www-form-urlencoded'}
resp = req('http://127.0.0.1:8000/token', data=login_data, headers=login_headers)
token = json.loads(resp).get('access_token')

if not token:
    print('Failed to login:', resp)
else:
    print('WORKOUT:', req('http://127.0.0.1:8000/workout/history', headers={'Authorization': f'Bearer {token}'}))
    print('MEALS:', req('http://127.0.0.1:8000/meals/history', headers={'Authorization': f'Bearer {token}'}))
